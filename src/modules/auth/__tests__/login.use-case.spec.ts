import { Test, TestingModule } from '@nestjs/testing'
import { LoginUseCase } from '../application/use-cases/login.use-case'
import { FindUserByEmailAndPasswordUseCase } from '../../users/application/use-cases/find-user-by-email-and-password.use-case'
import { CreateOtpUseCase } from '../../otp/application/use-cases/create-otp.use-case'
import { JwtService } from '@nestjs/jwt'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { CacheRepository } from '@/providers/cache/cache-repository'
import { SendEmailQueueProvider } from '@/providers/email/job/send-email-queue/send-email-queue.provider'
import { EmailTemplatesService } from '@/providers/email/templates/email-templates.service'
import { OtpPurpose } from '../../otp/domain/enums/otp.enum'
import { SubjectEmail } from '@/providers/email/enums/subject-email.enum'
import { AuthTaskType } from '../domain/enums/auth.enum'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import * as bcrypt from 'bcryptjs'
import { EmailProvider } from '@/providers/email/nodemailer/email.provider'

jest.mock('bcryptjs')
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

describe('LoginUseCase', () => {
  let useCase: LoginUseCase
  let findUserByEmailAndPasswordUseCase: jest.Mocked<FindUserByEmailAndPasswordUseCase>
  let createOtpUseCase: jest.Mocked<CreateOtpUseCase>
  let jwtService: jest.Mocked<JwtService>
  let envConfigService: jest.Mocked<EnvConfigService>
  let cache: jest.Mocked<CacheRepository>
  let sendEmailQueueProvider: jest.Mocked<SendEmailQueueProvider>
  let emailTemplatesService: jest.Mocked<EmailTemplatesService>

  const mockFindUserByEmailAndPasswordUseCase = {
    execute: jest.fn(),
  }

  const mockCreateOtpUseCase = {
    execute: jest.fn(),
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
  }

  const mockSendEmailQueueProvider = {
    execute: jest.fn(),
  }

  const mockEmailTemplatesService = {
    generateOtpEmail: jest.fn(),
  }

  const mockEmailProvider = {
    sendEmail: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: FindUserByEmailAndPasswordUseCase,
          useValue: mockFindUserByEmailAndPasswordUseCase,
        },
        {
          provide: CreateOtpUseCase,
          useValue: mockCreateOtpUseCase,
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
          provide: EmailProvider,
          useValue: mockEmailProvider,
        },
        {
          provide: EmailTemplatesService,
          useValue: mockEmailTemplatesService,
        },
      ],
    }).compile()

    useCase = module.get<LoginUseCase>(LoginUseCase)
    findUserByEmailAndPasswordUseCase = module.get(
      FindUserByEmailAndPasswordUseCase,
    )
    createOtpUseCase = module.get(CreateOtpUseCase)
    jwtService = module.get(JwtService)
    envConfigService = module.get(EnvConfigService)
    cache = module.get(CacheRepository)
    sendEmailQueueProvider = module.get(SendEmailQueueProvider)
    emailTemplatesService = module.get(EmailTemplatesService)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should login successfully and return OTP challenge response', async () => {
      const request = {
        email: 'test@example.com',
        password: 'password123',
      }

      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockOtpResponse = {
        hash: 'hash123',
        expiresAt: new Date(Date.now() + 300000),
        otpCode: '123456',
      }

      const mockOtpToken = 'jwt.otp.token'
      const mockEmailHtml = '<html>OTP Email</html>'

      findUserByEmailAndPasswordUseCase.execute.mockResolvedValue(mockUser)
      mockBcrypt.compare.mockResolvedValue(true as never)
      createOtpUseCase.execute.mockResolvedValue(mockOtpResponse as never)
      jwtService.sign.mockReturnValue(mockOtpToken)
      envConfigService.get.mockReturnValue('JWT_OTP_SECRET')
      emailTemplatesService.generateOtpEmail.mockReturnValue(mockEmailHtml)

      const result = await useCase.execute(request)

      expect(result).toEqual({
        message: 'Código OTP enviado para seu email',
        taskType: AuthTaskType.OTP_CHALLENGER,
        accessToken: mockOtpToken,
        validationUrl: `/auth/validate-otp/${mockOtpResponse.hash}`,
      })

      expect(findUserByEmailAndPasswordUseCase.execute).toHaveBeenCalledWith({
        email: request.email,
        password: request.password,
      })
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        request.password,
        mockUser.password,
      )
      expect(createOtpUseCase.execute).toHaveBeenCalledWith({
        email: mockUser.email,
        purpose: OtpPurpose.LOGIN,
      })
      expect(cache.invalidateCache).toHaveBeenCalledWith(
        `otp_session:${mockUser.id}:*`,
      )
      expect(cache.set).toHaveBeenCalled()
      expect(jwtService.sign).toHaveBeenCalled()
      expect(emailTemplatesService.generateOtpEmail).toHaveBeenCalled()
      expect(sendEmailQueueProvider.execute).toHaveBeenCalledWith({
        recipient: mockUser.email,
        subject: SubjectEmail.TOKEN_ACCESS,
        body: mockEmailHtml,
      })
    })

    it('should throw error when user is not found', async () => {
      const request = {
        email: 'nonexistent@example.com',
        password: 'password123',
      }

      findUserByEmailAndPasswordUseCase.execute.mockResolvedValue(null)

      await expect(useCase.execute(request)).rejects.toThrow(
        new CustomException(ErrorMessages.USER.INVALID_CREDENTIALS()),
      )

      expect(findUserByEmailAndPasswordUseCase.execute).toHaveBeenCalledWith({
        email: request.email,
        password: request.password,
      })
      expect(mockBcrypt.compare).not.toHaveBeenCalled()
    })

    it('should throw error when password is invalid', async () => {
      const request = {
        email: 'test@example.com',
        password: 'wrongpassword',
      }

      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      findUserByEmailAndPasswordUseCase.execute.mockResolvedValue(mockUser)
      mockBcrypt.compare.mockResolvedValue(false as never)

      await expect(useCase.execute(request)).rejects.toThrow(
        new CustomException(ErrorMessages.USER.INVALID_CREDENTIALS()),
      )

      expect(findUserByEmailAndPasswordUseCase.execute).toHaveBeenCalledWith({
        email: request.email,
        password: request.password,
      })
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        request.password,
        mockUser.password,
      )
      expect(createOtpUseCase.execute).not.toHaveBeenCalled()
    })
  })
})
