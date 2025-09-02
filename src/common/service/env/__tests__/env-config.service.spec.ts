import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { EnvConfigService } from '../env-config.service'
import { Env } from '../env'

describe('EnvConfigService', () => {
  let service: EnvConfigService
  let configService: jest.Mocked<ConfigService<Env, true>>

  const mockConfigService = {
    get: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnvConfigService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile()

    service = module.get<EnvConfigService>(EnvConfigService)
    configService = module.get(ConfigService)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should extend Injectable', () => {
    expect(service).toBeInstanceOf(EnvConfigService)
  })

  describe('get', () => {
    it('should get configuration value with infer option', () => {
      const mockValue = 'test-value'
      const key = 'NODE_ENV' as keyof Env

      configService.get.mockReturnValue(mockValue)

      const result = service.get(key)

      expect(result).toBe(mockValue)
      expect(configService.get).toHaveBeenCalledWith(key, { infer: true })
    })

    it('should get different configuration values', () => {
      const mockValues = {
        NODE_ENV: 'development',
        PORT: 3000,
        DATABASE_URL: 'postgresql://localhost:5432/test',
      }

      Object.entries(mockValues).forEach(([key, value]) => {
        configService.get.mockReturnValueOnce(value)
        const result = service.get(key as keyof Env)
        expect(result).toBe(value)
        expect(configService.get).toHaveBeenCalledWith(key, { infer: true })
      })
    })

    it('should handle undefined configuration values', () => {
      const key = 'UNDEFINED_KEY' as keyof Env

      configService.get.mockReturnValue(undefined)

      const result = service.get(key)

      expect(result).toBeUndefined()
      expect(configService.get).toHaveBeenCalledWith(key, { infer: true })
    })

    it('should handle null configuration values', () => {
      const key = 'NULL_KEY' as keyof Env

      configService.get.mockReturnValue(null)

      const result = service.get(key)

      expect(result).toBeNull()
      expect(configService.get).toHaveBeenCalledWith(key, { infer: true })
    })

    it('should handle boolean configuration values', () => {
      const key = 'ENABLE_LOGGING' as keyof Env

      configService.get.mockReturnValue(true)

      const result = service.get(key)

      expect(result).toBe(true)
      expect(configService.get).toHaveBeenCalledWith(key, { infer: true })
    })

    it('should handle numeric configuration values', () => {
      const key = 'TIMEOUT' as keyof Env

      configService.get.mockReturnValue(5000)

      const result = service.get(key)

      expect(result).toBe(5000)
      expect(configService.get).toHaveBeenCalledWith(key, { infer: true })
    })

    it('should handle array configuration values', () => {
      const key = 'ALLOWED_ORIGINS' as keyof Env
      const mockArray = ['http://localhost:3000', 'https://example.com']

      configService.get.mockReturnValue(mockArray)

      const result = service.get(key)

      expect(result).toEqual(mockArray)
      expect(configService.get).toHaveBeenCalledWith(key, { infer: true })
    })

    it('should handle object configuration values', () => {
      const key = 'DATABASE_CONFIG' as keyof Env
      const mockObject = {
        host: 'localhost',
        port: 5432,
        database: 'test',
      }

      configService.get.mockReturnValue(mockObject)

      const result = service.get(key)

      expect(result).toEqual(mockObject)
      expect(configService.get).toHaveBeenCalledWith(key, { infer: true })
    })
  })
})
