import { Test, TestingModule } from '@nestjs/testing'
import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { GlobalJwtAuthGuard } from '../global-jwt-auth.guard'
import { EnvConfigService } from '../../service/env/env-config.service'
import { CacheRepository } from '@/providers/cache/cache-repository'
import { CustomException } from '../../exceptions/customException'
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator'

describe('GlobalJwtAuthGuard', () => {
  let guard: GlobalJwtAuthGuard
  let reflector: jest.Mocked<Reflector>
  let jwtService: jest.Mocked<JwtService>
  let envConfigService: jest.Mocked<EnvConfigService>
  let cache: jest.Mocked<CacheRepository>

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  }

  const mockJwtService = {
    verify: jest.fn(),
  }

  const mockEnvConfigService = {
    get: jest.fn(),
  }

  const mockCache = {
    get: jest.fn(),
  }

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: {},
        user: undefined,
      }),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown as ExecutionContext

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlobalJwtAuthGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: EnvConfigService,
          useValue: mockEnvConfigService,
        },
        {
          provide: CacheRepository,
          useValue: mockCache,
        },
      ],
    }).compile()

    guard = module.get<GlobalJwtAuthGuard>(GlobalJwtAuthGuard)
    reflector = module.get(Reflector)
    jwtService = module.get(JwtService)
    envConfigService = module.get(EnvConfigService)
    cache = module.get(CacheRepository)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('canActivate', () => {
    it('should allow access when route is public', async () => {
      reflector.getAllAndOverride.mockReturnValue(true)

      const result = await guard.canActivate(mockExecutionContext)

      expect(result).toBe(true)
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ])
    })

    it('should validate OTP token when route requires OTP auth', async () => {
      reflector.getAllAndOverride
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)

      const mockRequest = {
        headers: { authorization: 'Bearer otp-token' },
        user: undefined,
      }

      mockExecutionContext.switchToHttp = jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      })

      const mockPayload = { type: 'otp', sub: 1, email: 'test@example.com' }
      jwtService.verify.mockReturnValue(mockPayload)
      envConfigService.get.mockReturnValue('otp-secret')

      const result = await guard.canActivate(mockExecutionContext)

      expect(result).toBe(true)
      expect(mockRequest.user).toEqual(mockPayload)
    })

    it('should validate access token when route requires regular auth', async () => {
      reflector.getAllAndOverride
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)

      const mockRequest = {
        headers: { authorization: 'Bearer access-token' },
        user: undefined,
      }

      mockExecutionContext.switchToHttp = jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      })

      const mockPayload = { sub: 1, email: 'test@example.com', hash: 'hash123' }
      jwtService.verify.mockReturnValue(mockPayload)
      envConfigService.get.mockReturnValue('jwt-secret')
      cache.get.mockResolvedValue('1')

      const result = await guard.canActivate(mockExecutionContext)

      expect(result).toBe(true)
      expect(mockRequest.user).toEqual(mockPayload)
    })

    it('should throw error when OTP token is invalid', async () => {
      reflector.getAllAndOverride
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)

      const mockRequest = {
        headers: { authorization: 'Bearer invalid-token' },
      }

      mockExecutionContext.switchToHttp = jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      })

      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token')
      })
      envConfigService.get.mockReturnValue('otp-secret')

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        CustomException,
      )
    })

    it('should throw error when access token is invalid', async () => {
      reflector.getAllAndOverride
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)

      const mockRequest = {
        headers: { authorization: 'Bearer invalid-token' },
      }

      mockExecutionContext.switchToHttp = jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      })

      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token')
      })

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        CustomException,
      )
    })

    it('should throw error when session is invalid', async () => {
      reflector.getAllAndOverride
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)

      const mockRequest = {
        headers: { authorization: 'Bearer access-token' },
      }

      mockExecutionContext.switchToHttp = jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      })

      const mockPayload = { sub: 1, hash: 'hash123' }
      jwtService.verify.mockReturnValue(mockPayload)
      envConfigService.get.mockReturnValue('jwt-secret')
      cache.get.mockResolvedValue(null)

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        CustomException,
      )
    })
  })
})
