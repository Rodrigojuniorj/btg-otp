import { Test, TestingModule } from '@nestjs/testing'
import { ValidateOtpUseCase } from '../application/use-cases/validate-otp.use-case'
import { OtpRepositoryPort } from '../domain/repositories/otp.repository.port'
import { Otp } from '../domain/entities/otp.entity'
import { OtpPurpose, OtpStatus } from '../domain/enums/otp.enum'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { EnvConfigService } from '@/common/service/env/env-config.service'

describe('ValidateOtpUseCase', () => {
  let useCase: ValidateOtpUseCase
  let otpRepository: jest.Mocked<OtpRepositoryPort>

  const mockOtpRepository = {
    findByHash: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn(),
    incrementAttempts: jest.fn(),
    findActiveByIdentifier: jest.fn(),
    expireOldOtps: jest.fn(),
    deleteExpiredOtps: jest.fn(),
  }

  const mockEnvConfigService = {
    get: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateOtpUseCase,
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

    useCase = module.get<ValidateOtpUseCase>(ValidateOtpUseCase)
    otpRepository = module.get(OtpRepositoryPort)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should validate OTP successfully', async () => {
      const request = {
        otpCode: '123456',
        hash: 'hash123',
      }

      const mockOtp = new Otp(
        1,
        'hash123',
        '123456',
        'test@example.com',
        OtpPurpose.GENERAL,
        OtpStatus.PENDING,
        0,
        new Date(Date.now() + 300000),
        new Date(),
        new Date(),
      )

      otpRepository.findByHash.mockResolvedValue(mockOtp)
      otpRepository.updateStatus.mockResolvedValue(undefined)

      await useCase.execute(request)

      expect(otpRepository.findByHash).toHaveBeenCalledWith(request.hash)
      expect(otpRepository.updateStatus).toHaveBeenCalledWith(
        mockOtp.id,
        OtpStatus.VALIDATED,
      )
    })

    it('should throw error when OTP is not found', async () => {
      const request = {
        otpCode: '123456',
        hash: 'nonexistent-hash',
      }

      otpRepository.findByHash.mockResolvedValue(null)

      await expect(useCase.execute(request)).rejects.toThrow(
        new CustomException(ErrorMessages.OTP.INVALID_OTP()),
      )

      expect(otpRepository.findByHash).toHaveBeenCalledWith(request.hash)
      expect(otpRepository.updateStatus).not.toHaveBeenCalled()
    })

    it('should throw error when OTP code is invalid', async () => {
      const request = {
        otpCode: 'wrong-code',
        hash: 'hash123',
      }

      const mockOtp = new Otp(
        1,
        'hash123',
        '123456',
        'test@example.com',
        OtpPurpose.GENERAL,
        OtpStatus.PENDING,
        0,
        new Date(Date.now() + 300000),
        new Date(),
        new Date(),
      )

      otpRepository.findByHash.mockResolvedValue(mockOtp)

      await expect(useCase.execute(request)).rejects.toThrow(
        new CustomException(ErrorMessages.OTP.INVALID_OTP_CODE()),
      )

      expect(otpRepository.findByHash).toHaveBeenCalledWith(request.hash)
      expect(otpRepository.updateStatus).not.toHaveBeenCalled()
    })

    it('should throw error when OTP is already verified', async () => {
      const request = {
        otpCode: '123456',
        hash: 'hash123',
      }

      const mockOtp = new Otp(
        1,
        'hash123',
        '123456',
        'test@example.com',
        OtpPurpose.GENERAL,
        OtpStatus.VALIDATED,
        0,
        new Date(Date.now() + 300000),
        new Date(),
        new Date(),
      )

      otpRepository.findByHash.mockResolvedValue(mockOtp)

      await expect(useCase.execute(request)).rejects.toThrow(
        new CustomException(ErrorMessages.OTP.OTP_USED()),
      )

      expect(otpRepository.findByHash).toHaveBeenCalledWith(request.hash)
      expect(otpRepository.updateStatus).not.toHaveBeenCalled()
    })

    it('should throw error when OTP is expired', async () => {
      const request = {
        otpCode: '123456',
        hash: 'hash123',
      }

      const mockOtp = new Otp(
        1,
        'hash123',
        '123456',
        'test@example.com',
        OtpPurpose.GENERAL,
        OtpStatus.PENDING,
        0,
        new Date(Date.now() - 1000), // Expired
        new Date(),
        new Date(),
      )

      otpRepository.findByHash.mockResolvedValue(mockOtp)

      await expect(useCase.execute(request)).rejects.toThrow(
        new CustomException(ErrorMessages.OTP.OTP_EXPIRED()),
      )

      expect(otpRepository.findByHash).toHaveBeenCalledWith(request.hash)
      expect(otpRepository.updateStatus).toHaveBeenCalledWith(
        mockOtp.id,
        OtpStatus.EXPIRED,
      )
    })
  })
})
