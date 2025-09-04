import { Test, TestingModule } from '@nestjs/testing'
import { CreateOtpUseCase } from '../application/use-cases/create-otp.use-case'
import { OtpRepositoryPort } from '../domain/repositories/otp.repository.port'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { Otp } from '../domain/entities/otp.entity'
import { OtpPurpose } from '../domain/enums/otp.enum'
import { CustomException } from '@/common/exceptions/customException'

describe('CreateOtpUseCase', () => {
  let useCase: CreateOtpUseCase
  let otpRepository: jest.Mocked<OtpRepositoryPort>
  let envConfigService: jest.Mocked<EnvConfigService>

  const mockOtpRepository = {
    create: jest.fn(),
    findByHash: jest.fn(),
    findActiveByIdentifier: jest.fn(),
    updateStatus: jest.fn(),
    incrementAttempts: jest.fn(),
    expireOldOtps: jest.fn(),
    deleteExpiredOtps: jest.fn(),
  }

  const mockEnvConfigService = {
    get: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOtpUseCase,
        {
          provide: OtpRepositoryPort,
          useValue: mockOtpRepository,
        },
        {
          provide: EnvConfigService,
          useValue: mockEnvConfigService,
        },
      ],
    }).compile()

    useCase = module.get<CreateOtpUseCase>(CreateOtpUseCase)
    otpRepository = module.get(OtpRepositoryPort)
    envConfigService = module.get(EnvConfigService)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  describe('execute', () => {
    it('should create OTP successfully', async () => {
      const request = {
        email: 'test@example.com',
        purpose: OtpPurpose.GENERAL,
      }

      envConfigService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'OTP_LENGTH':
            return 6
          case 'OTP_MINUTE_DURATION':
            return 5
          default:
            return 'default'
        }
      })

      otpRepository.findActiveByIdentifier.mockResolvedValue(null)
      otpRepository.expireOldOtps.mockResolvedValue(undefined)
      otpRepository.create.mockResolvedValue(
        Otp.create(
          'test-hash',
          '123456',
          'test@example.com',
          OtpPurpose.GENERAL,
          new Date(),
        ),
      )

      const result = await useCase.execute(request)

      expect(otpRepository.findActiveByIdentifier).toHaveBeenCalledWith(
        'test@example.com',
      )
      expect(otpRepository.expireOldOtps).toHaveBeenCalledWith(
        'test@example.com',
        OtpPurpose.GENERAL,
      )
      expect(otpRepository.create).toHaveBeenCalled()
      expect(result).toHaveProperty('hash')
      expect(result).toHaveProperty('otpCode')
      expect(result).toHaveProperty('identifier', 'test@example.com')
      expect(result).toHaveProperty('purpose', 'general')
    })

    it('should throw error when email is not provided', async () => {
      const request = {
        email: '',
        purpose: OtpPurpose.GENERAL,
      }

      await expect(useCase.execute(request)).rejects.toThrow(CustomException)
    })

    it('should throw error when OTP is already active', async () => {
      const request = {
        email: 'test@example.com',
        purpose: OtpPurpose.GENERAL,
      }

      const existingOtp = Otp.create(
        'existing-hash',
        '123456',
        'test@example.com',
        OtpPurpose.GENERAL,
        new Date(Date.now() + 60000), // 1 minute from now
      )

      otpRepository.findActiveByIdentifier.mockResolvedValue(existingOtp)

      await expect(useCase.execute(request)).rejects.toThrow(CustomException)
    })

    it('should create OTP when existing OTP is expired', async () => {
      const request = {
        email: 'test@example.com',
        purpose: OtpPurpose.GENERAL,
      }

      const expiredOtp = Otp.create(
        'expired-hash',
        '123456',
        'test@example.com',
        OtpPurpose.GENERAL,
        new Date(Date.now() - 60000), // 1 minute ago
      )

      envConfigService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'OTP_LENGTH':
            return 6
          case 'OTP_MINUTE_DURATION':
            return 5
          default:
            return 'default'
        }
      })

      otpRepository.findActiveByIdentifier.mockResolvedValue(expiredOtp)
      otpRepository.expireOldOtps.mockResolvedValue(undefined)
      otpRepository.create.mockResolvedValue(
        Otp.create(
          'new-hash',
          '654321',
          'test@example.com',
          OtpPurpose.GENERAL,
          new Date(),
        ),
      )

      const result = await useCase.execute(request)

      expect(result).toHaveProperty('hash')
      expect(result).toHaveProperty('otpCode')
    })
  })
})
