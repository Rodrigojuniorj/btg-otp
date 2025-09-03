import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from '../auth.service'
import { UsersService } from '../../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { CacheRepository } from '@/providers/cache/cache-repository'
import { SendEmailQueueProvider } from '@/providers/email/job/send-email-queue/send-email-queue.provider'
import { EmailTemplatesService } from '@/providers/email/templates'
import { OtpService } from '../../otp/otp.service'
import { RegisterDto } from '../dtos/register.dto'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { OtpPurpose } from '../../otp/enums/otp.enum'
import * as bcrypt from 'bcryptjs'
import { OtpDto } from '@/modules/otp/dto/otp.dto'
import { UserResponseDto } from '@/modules/users/dto/user-response.dto'
import { UserResponsePasswordDto } from '@/modules/users/dto/user-response-password.dto'
import { AuthValidateOtpDto } from '../dtos/auth-validate-otp.dto'

jest.mock('bcryptjs')
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

describe('AuthService', () => {
  let service: AuthService
  let usersService: jest.Mocked<UsersService>
  let jwtService: jest.Mocked<JwtService>
  let envConfigService: jest.Mocked<EnvConfigService>
  let cache: jest.Mocked<CacheRepository>
  let sendEmailQueueProvider: jest.Mocked<SendEmailQueueProvider>
  let emailTemplatesService: jest.Mocked<EmailTemplatesService>
  let otpService: jest.Mocked<OtpService>

  const mockUsersService = {
    findByEmailAndPassword: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
  }

  const mockJwtService = {
    sign: jest.fn(),
  }

  const mockEnvConfigService = {
    get: jest.fn(),
  }

  const mockCache = {
    invalidateCache: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  }

  const mockSendEmailQueueProvider = {
    execute: jest.fn(),
  }

  const mockEmailTemplatesService = {
    generateOtpEmail: jest.fn(),
  }

  const mockOtpService = {
    create: jest.fn(),
    validateOtp: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
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
        {
          provide: SendEmailQueueProvider,
          useValue: mockSendEmailQueueProvider,
        },
        {
          provide: EmailTemplatesService,
          useValue: mockEmailTemplatesService,
        },
        {
          provide: OtpService,
          useValue: mockOtpService,
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    usersService = module.get(UsersService)
    jwtService = module.get(JwtService)
    envConfigService = module.get(EnvConfigService)
    cache = module.get(CacheRepository)
    sendEmailQueueProvider = module.get(SendEmailQueueProvider)
    emailTemplatesService = module.get(EmailTemplatesService)
    otpService = module.get(OtpService)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('validateUser', () => {
    it('should validate user successfully', async () => {
      const email = 'test@example.com'
      const password = 'password123'
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
      }

      usersService.findByEmailAndPassword.mockResolvedValue(
        mockUser as UserResponsePasswordDto,
      )
      mockBcrypt.compare.mockResolvedValue(true as never)

      const result = await service.validateUser(email, password)

      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      })
      expect(usersService.findByEmailAndPassword).toHaveBeenCalledWith(email)
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUser.password,
      )
    })

    it('should throw error when user is not found', async () => {
      const email = 'nonexistent@example.com'
      const password = 'password123'

      usersService.findByEmailAndPassword.mockResolvedValue(null)

      await expect(service.validateUser(email, password)).rejects.toThrow(
        new CustomException(ErrorMessages.USER.INVALID_CREDENTIALS()),
      )
    })

    it('should throw error when password is invalid', async () => {
      const email = 'test@example.com'
      const password = 'wrongpassword'
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
      }

      usersService.findByEmailAndPassword.mockResolvedValue(
        mockUser as UserResponsePasswordDto,
      )
      mockBcrypt.compare.mockResolvedValue(false as never)

      await expect(service.validateUser(email, password)).rejects.toThrow(
        new CustomException(ErrorMessages.USER.INVALID_CREDENTIALS()),
      )
    })
  })

  describe('register', () => {
    it('should register user successfully', async () => {
      const registerDto: RegisterDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }

      usersService.findByEmail.mockResolvedValue(null)
      usersService.create.mockResolvedValue(undefined)

      await service.register(registerDto)

      expect(usersService.findByEmail).toHaveBeenCalledWith(registerDto.email)
      expect(usersService.create).toHaveBeenCalledWith({
        name: registerDto.name,
        email: registerDto.email,
        password: registerDto.password,
      })
    })

    it('should throw error when email already exists', async () => {
      const registerDto: RegisterDto = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      }

      const existingUser = {
        id: 1,
        email: 'existing@example.com',
        name: 'Existing User',
      }

      usersService.findByEmail.mockResolvedValue(
        existingUser as UserResponseDto,
      )

      await expect(service.register(registerDto)).rejects.toThrow(
        new CustomException(ErrorMessages.USER.EMAIL_EXISTS()),
      )
    })
  })

  describe('login', () => {
    it('should login successfully and create OTP', async () => {
      const email = 'test@example.com'
      const password = 'password123'
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
      }

      const mockOtpResponse = {
        hash: 'otpHash123',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        otpCode: '123456',
      }

      const mockJwtToken = 'jwt.token.here'
      const mockEmailHtml = '<html>OTP Email</html>'

      usersService.findByEmailAndPassword.mockResolvedValue(
        mockUser as UserResponsePasswordDto,
      )
      mockBcrypt.compare.mockResolvedValue(true as never)
      otpService.create.mockResolvedValue(mockOtpResponse as OtpDto)
      cache.invalidateCache.mockResolvedValue(undefined)
      cache.set.mockResolvedValue(undefined)
      jwtService.sign.mockReturnValue(mockJwtToken)
      emailTemplatesService.generateOtpEmail.mockReturnValue(mockEmailHtml)
      sendEmailQueueProvider.execute.mockResolvedValue(undefined)
      envConfigService.get
        .mockReturnValueOnce('jwt-otp-secret')
        .mockReturnValueOnce(5)

      const result = await service.login(email, password)

      expect(result).toEqual({
        accessToken: mockJwtToken,
        validationUrl: `/auth/validate-otp/${mockOtpResponse.hash}`,
      })
      expect(otpService.create).toHaveBeenCalledWith({
        email: mockUser.email,
        purpose: OtpPurpose.LOGIN,
      })
      expect(cache.set).toHaveBeenCalled()
      expect(sendEmailQueueProvider.execute).toHaveBeenCalled()
    })
  })

  describe('validate', () => {
    it('should validate OTP successfully', async () => {
      const validateOtpDto: AuthValidateOtpDto = {
        otpCode: '123456',
      }

      const mockUserOtp = {
        sub: 1,
        email: 'test@example.com',
        hash: 'otpHash123',
        type: 'otp' as const,
      }

      const mockAccessToken = 'access.token.here'

      cache.get.mockResolvedValue('1')
      otpService.validateOtp.mockResolvedValue(undefined)
      cache.delete.mockResolvedValue(undefined)
      jwtService.sign.mockReturnValue(mockAccessToken)
      cache.set.mockResolvedValue(undefined)
      envConfigService.get
        .mockReturnValueOnce('jwt-secret')
        .mockReturnValueOnce('1h')

      const result = await service.validate(validateOtpDto, mockUserOtp)

      expect(result).toEqual({
        accessToken: mockAccessToken,
      })
      expect(otpService.validateOtp).toHaveBeenCalledWith({
        otpCode: validateOtpDto.otpCode,
        hash: mockUserOtp.hash,
      })
      expect(cache.set).toHaveBeenCalled()
    })

    it('should throw error when session is invalid', async () => {
      const validateOtpDto: AuthValidateOtpDto = {
        otpCode: '123456',
      }

      const mockUserOtp = {
        sub: 1,
        email: 'test@example.com',
        hash: 'otpHash123',
        type: 'otp' as const,
      }

      cache.get.mockResolvedValue(null)

      await expect(
        service.validate(validateOtpDto, mockUserOtp),
      ).rejects.toThrow(
        new CustomException(ErrorMessages.USER.INVALID_CREDENTIALS()),
      )
    })

    it('should throw error when session user ID does not match', async () => {
      const validateOtpDto: AuthValidateOtpDto = {
        otpCode: '123456',
      }

      const mockUserOtp = {
        sub: 1,
        email: 'test@example.com',
        hash: 'otpHash123',
        type: 'otp' as const,
      }

      cache.get.mockResolvedValue('999')

      await expect(
        service.validate(validateOtpDto, mockUserOtp),
      ).rejects.toThrow(
        new CustomException(ErrorMessages.USER.INVALID_CREDENTIALS()),
      )
    })
  })
})
