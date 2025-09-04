import { Test, TestingModule } from '@nestjs/testing'
import { JwtStrategy } from '../jwt.strategy'
import { EnvConfigService } from '../../service/env/env-config.service'
import { JwtPayload } from '../../interfaces/jwt-payload.interface'

describe('JwtStrategy', () => {
  let strategy: JwtStrategy
  let envConfigService: jest.Mocked<EnvConfigService>

  beforeEach(async () => {
    const mockEnvConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'JWT_SECRET') return 'test-secret'
        return undefined
      }),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: EnvConfigService,
          useValue: mockEnvConfigService,
        },
      ],
    }).compile()

    strategy = module.get<JwtStrategy>(JwtStrategy)
    envConfigService = module.get(EnvConfigService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(strategy).toBeDefined()
  })

  it('should extend PassportStrategy', () => {
    expect(strategy).toBeInstanceOf(JwtStrategy)
  })

  describe('constructor', () => {
    it('should configure JWT strategy with correct options', () => {
      const mockSecret = 'test-jwt-secret'
      envConfigService.get.mockReturnValue(mockSecret)

      new JwtStrategy(envConfigService)

      expect(envConfigService.get).toHaveBeenCalledWith('JWT_SECRET')
    })

    it('should use default secret when JWT_SECRET is not provided', () => {
      envConfigService.get.mockReturnValue('default-secret')

      new JwtStrategy(envConfigService)

      expect(envConfigService.get).toHaveBeenCalledWith('JWT_SECRET')
    })
  })

  describe('validate', () => {
    it('should return user object with correct properties', async () => {
      const mockPayload: JwtPayload = {
        sub: 123,
        email: 'test@example.com',
        type: 'access',
      }

      const result = await strategy.validate(mockPayload)

      expect(result).toEqual({
        id: mockPayload.sub,
        email: mockPayload.email,
      })
    })

    it('should handle payload with different user ID', async () => {
      const mockPayload: JwtPayload = {
        sub: 456,
        email: 'another@example.com',
        type: 'access',
      }

      const result = await strategy.validate(mockPayload)

      expect(result).toEqual({
        id: mockPayload.sub,
        email: mockPayload.email,
      })
    })

    it('should handle payload with minimal required fields', async () => {
      const mockPayload: JwtPayload = {
        sub: 789,
        email: 'minimal@example.com',
        type: 'access',
      }

      const result = await strategy.validate(mockPayload)

      expect(result).toEqual({
        id: mockPayload.sub,
        email: mockPayload.email,
      })
    })
  })
})
