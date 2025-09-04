import { Test, TestingModule } from '@nestjs/testing'
import { AuthValidateOtpUseCase } from '../application/use-cases/validate-otp.use-case'
import { ValidateOtpUseCase } from '../../otp/application/use-cases/validate-otp.use-case'
import { JwtService } from '@nestjs/jwt'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { CacheRepository } from '@/providers/cache/cache-repository'
import { JwtTypeSign } from '@/common/enums/jwt-type-sign.enum'
import { parseTimeToSeconds } from '@/common/utils/parse-time-to-seconds.util'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

jest.mock('@/common/utils/parse-time-to-seconds.util')
const mockParseTimeToSeconds = parseTimeToSeconds as jest.MockedFunction<
  typeof parseTimeToSeconds
>

describe('AuthValidateOtpUseCase', () => {
  let useCase: AuthValidateOtpUseCase
  let validateOtpUseCase: jest.Mocked<ValidateOtpUseCase>
  let jwtService: jest.Mocked<JwtService>
  let envConfigService: jest.Mocked<EnvConfigService>
  let cache: jest.Mocked<CacheRepository>

  const mockValidateOtpUseCase = {
    execute: jest.fn(),
  }

  const mockJwtService = {
    sign: jest.fn(),
  }

  const mockEnvConfigService = {
    get: jest.fn(),
  }

  const mockCache = {
    get: jest.fn(),
    delete: jest.fn(),
    set: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthValidateOtpUseCase,
        {
          provide: ValidateOtpUseCase,
          useValue: mockValidateOtpUseCase,
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

    useCase = module.get<AuthValidateOtpUseCase>(AuthValidateOtpUseCase)
    validateOtpUseCase = module.get(ValidateOtpUseCase)
    jwtService = module.get(JwtService)
    envConfigService = module.get(EnvConfigService)
    cache = module.get(CacheRepository)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should validate OTP successfully and return access token', async () => {
      const request = {
        otpCode: '123456',
        user: {
          sub: 1,
          email: 'test@example.com',
          hash: 'hash123',
        },
      }

      const mockAccessToken = 'access.token.here'
      const mockJwtExpiresIn = '1h'
      const mockJwtSecret = 'jwt-secret'
      const mockTtlSeconds = 3600

      cache.get.mockResolvedValue('1')
      validateOtpUseCase.execute.mockResolvedValue(undefined)
      jwtService.sign.mockReturnValue(mockAccessToken)
      envConfigService.get.mockImplementation((key: string) => {
        if (key === 'JWT_EXPIRES_IN') return mockJwtExpiresIn
        if (key === 'JWT_SECRET') return mockJwtSecret
        return ''
      })
      mockParseTimeToSeconds.mockReturnValue(mockTtlSeconds)

      const result = await useCase.execute(request)

      expect(result).toEqual({
        accessToken: mockAccessToken,
      })

      expect(cache.get).toHaveBeenCalledWith(
        `otp_session:${request.user.sub}:${request.user.hash}`,
      )
      expect(validateOtpUseCase.execute).toHaveBeenCalledWith({
        otpCode: request.otpCode,
        hash: request.user.hash,
      })
      expect(cache.delete).toHaveBeenCalledWith(
        `otp_session:${request.user.hash}`,
      )
      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          sub: request.user.sub,
          email: request.user.email,
          type: JwtTypeSign.ACCESS,
          hash: request.user.hash,
        },
        {
          expiresIn: mockJwtExpiresIn,
          secret: mockJwtSecret,
        },
      )
      expect(cache.set).toHaveBeenCalledWith(
        `otp_session:${request.user.sub}:${request.user.hash}`,
        request.user.sub.toString(),
        mockTtlSeconds,
      )
    })

    it('should throw error when session is invalid', async () => {
      const request = {
        otpCode: '123456',
        user: {
          sub: 1,
          email: 'test@example.com',
          hash: 'hash123',
        },
      }

      cache.get.mockResolvedValue(null)

      await expect(useCase.execute(request)).rejects.toThrow(
        new CustomException(ErrorMessages.USER.INVALID_CREDENTIALS()),
      )

      expect(cache.get).toHaveBeenCalledWith(
        `otp_session:${request.user.sub}:${request.user.hash}`,
      )
      expect(validateOtpUseCase.execute).not.toHaveBeenCalled()
    })

    it('should throw error when session user ID does not match', async () => {
      const request = {
        otpCode: '123456',
        user: {
          sub: 1,
          email: 'test@example.com',
          hash: 'hash123',
        },
      }

      cache.get.mockResolvedValue('2') // Different user ID

      await expect(useCase.execute(request)).rejects.toThrow(
        new CustomException(ErrorMessages.USER.INVALID_CREDENTIALS()),
      )

      expect(cache.get).toHaveBeenCalledWith(
        `otp_session:${request.user.sub}:${request.user.hash}`,
      )
      expect(validateOtpUseCase.execute).not.toHaveBeenCalled()
    })
  })
})
