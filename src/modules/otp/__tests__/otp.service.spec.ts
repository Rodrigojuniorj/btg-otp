import { Test, TestingModule } from '@nestjs/testing'
import { OtpService } from '../otp.service'
import { OtpRepository } from '../repositories/otp.repository'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { CreateOtpDto } from '../dto/create-otp.dto'

import { OtpPurpose, OtpStatus } from '../enums/otp.enum'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { HttpStatus } from '@nestjs/common'
import { OtpDto } from '../dto/otp.dto'
import { OtpRepositoryPort } from '../repositories/port/otp.repository.port'
import { ValidateOtpDto } from '../dto/validate-otp.dto'

describe('OtpService', () => {
  let service: OtpService
  let otpRepository: jest.Mocked<OtpRepository>
  let envConfigService: jest.Mocked<EnvConfigService>

  const mockOtpRepository = {
    findActiveByIdentifier: jest.fn(),
    expireOldOtps: jest.fn(),
    create: jest.fn(),
    findByHash: jest.fn(),
    updateStatus: jest.fn(),
    incrementAttempts: jest.fn(),
  }

  const mockEnvConfigService = {
    get: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
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

    service = module.get<OtpService>(OtpService)
    otpRepository = module.get(OtpRepositoryPort)
    envConfigService = module.get(EnvConfigService)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    const createOtpDto: CreateOtpDto = {
      email: 'test@example.com',
      purpose: OtpPurpose.GENERAL,
    }

    it('should create OTP successfully', async () => {
      const mockOtpCode = '123456'
      const mockHash = 'hash123'
      const mockExpiresAt = new Date(Date.now() + 5 * 60 * 1000)

      const mockOtp = {
        hash: mockHash,
        otpCode: mockOtpCode,
        identifier: createOtpDto.email,
        purpose: createOtpDto.purpose,
        expiresAt: mockExpiresAt,
        status: OtpStatus.PENDING,
      }

      otpRepository.findActiveByIdentifier.mockResolvedValue(null)
      otpRepository.expireOldOtps.mockResolvedValue(undefined)
      otpRepository.create.mockResolvedValue(mockOtp as OtpDto)

      jest.doMock('@/common/utils/generate-otp-code.util', () => ({
        generateOtpCode: jest.fn().mockReturnValue(mockOtpCode),
      }))
      jest.doMock('@/common/utils/generate-unique-hash.util', () => ({
        generateUniqueHash: jest.fn().mockReturnValue(mockHash),
      }))

      const result = await service.create(createOtpDto)

      expect(result).toEqual({
        hash: expect.any(String),
        expiresAt: expect.any(Date),
        otpCode: expect.any(String),
        identifier: createOtpDto.email,
        purpose: createOtpDto.purpose,
      })
      expect(otpRepository.findActiveByIdentifier).toHaveBeenCalledWith(
        createOtpDto.email,
      )
      expect(otpRepository.expireOldOtps).toHaveBeenCalledWith(
        createOtpDto.email,
        createOtpDto.purpose,
      )
      expect(otpRepository.create).toHaveBeenCalledWith({
        hash: expect.any(String),
        otpCode: expect.any(String),
        identifier: createOtpDto.email,
        purpose: createOtpDto.purpose,
        expiresAt: expect.any(Date),
        status: OtpStatus.PENDING,
      })
    })

    it('should throw error when email is not provided', async () => {
      const invalidDto = { ...createOtpDto, email: '' }

      await expect(service.create(invalidDto)).rejects.toThrow(
        new CustomException(
          ErrorMessages.OTP.OTP_CREATE(),
          HttpStatus.BAD_REQUEST,
        ),
      )
    })

    it('should throw error when OTP is already active', async () => {
      const existingOtp = {
        id: 1,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        status: OtpStatus.PENDING,
      }

      otpRepository.findActiveByIdentifier.mockResolvedValue(
        existingOtp as OtpDto,
      )

      await expect(service.create(createOtpDto)).rejects.toThrow(
        new CustomException(
          ErrorMessages.OTP.OTP_ALREADY_ACTIVE(),
          HttpStatus.CONFLICT,
        ),
      )
    })

    it('should create OTP when existing OTP is expired', async () => {
      const expiredOtp = {
        id: 1,
        expiresAt: new Date(Date.now() - 10 * 60 * 1000),
        status: OtpStatus.PENDING,
      }

      otpRepository.findActiveByIdentifier.mockResolvedValue(
        expiredOtp as OtpDto,
      )
      otpRepository.expireOldOtps.mockResolvedValue(undefined)
      otpRepository.create.mockResolvedValue({} as OtpDto)

      const result = await service.create(createOtpDto)

      expect(result).toBeDefined()
      expect(otpRepository.create).toHaveBeenCalled()
    })

    describe('validateOtp', () => {
      const validateOtpDto: ValidateOtpDto = {
        otpCode: '123456',
        hash: 'hash123',
      }

      it('should validate OTP successfully', async () => {
        const mockOtp = {
          id: 1,
          otpCode: '123456',
          status: OtpStatus.PENDING,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          attempts: 0,
        }

        otpRepository.findByHash.mockResolvedValue(mockOtp as OtpDto)
        otpRepository.updateStatus.mockResolvedValue(undefined)

        await service.validateOtp(validateOtpDto)

        expect(otpRepository.updateStatus).toHaveBeenCalledWith(
          mockOtp.id,
          OtpStatus.VALIDATED,
        )
      })

      it('should throw error when OTP hash is not found', async () => {
        otpRepository.findByHash.mockResolvedValue(null)

        await expect(service.validateOtp(validateOtpDto)).rejects.toThrow(
          new CustomException(
            ErrorMessages.OTP.INVALID_OTP(),
            HttpStatus.UNAUTHORIZED,
          ),
        )
      })

      it('should throw error when OTP is already used', async () => {
        const usedOtp = {
          id: 1,
          otpCode: '123456',
          status: OtpStatus.VALIDATED,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          attempts: 0,
        }

        otpRepository.findByHash.mockResolvedValue(usedOtp as OtpDto)

        await expect(service.validateOtp(validateOtpDto)).rejects.toThrow(
          new CustomException(
            ErrorMessages.OTP.OTP_USED(),
            HttpStatus.UNAUTHORIZED,
          ),
        )
      })

      it('should throw error when OTP is expired', async () => {
        const expiredOtp = {
          id: 1,
          otpCode: '123456',
          status: OtpStatus.PENDING,
          expiresAt: new Date(Date.now() - 5 * 60 * 1000),
          attempts: 0,
        }

        otpRepository.findByHash.mockResolvedValue(expiredOtp as OtpDto)
        otpRepository.updateStatus.mockResolvedValue(undefined)

        await expect(service.validateOtp(validateOtpDto)).rejects.toThrow(
          new CustomException(
            ErrorMessages.OTP.OTP_EXPIRED(),
            HttpStatus.UNAUTHORIZED,
          ),
        )
        expect(otpRepository.updateStatus).toHaveBeenCalledWith(
          expiredOtp.id,
          OtpStatus.EXPIRED,
        )
      })

      it('should throw error when max attempts exceeded', async () => {
        const maxAttemptsOtp = {
          id: 1,
          otpCode: '123456',
          status: OtpStatus.PENDING,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          attempts: 4,
        }

        otpRepository.findByHash.mockResolvedValue(maxAttemptsOtp as OtpDto)
        otpRepository.updateStatus.mockResolvedValue(undefined)

        envConfigService.get.mockReturnValue(3)

        await expect(service.validateOtp(validateOtpDto)).rejects.toThrow(
          new CustomException(
            ErrorMessages.OTP.MAX_ATTEMPTS_EXCEEDED(),
            HttpStatus.UNAUTHORIZED,
          ),
        )
        expect(otpRepository.updateStatus).toHaveBeenCalledWith(
          maxAttemptsOtp.id,
          OtpStatus.FAILED,
        )
      })

      it('should increment attempts when OTP code is invalid', async () => {
        const invalidOtp = {
          id: 1,
          otpCode: '654321',
          status: OtpStatus.PENDING,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          attempts: 0,
        }

        otpRepository.findByHash.mockResolvedValue(invalidOtp as OtpDto)
        otpRepository.incrementAttempts.mockResolvedValue(undefined)

        await expect(service.validateOtp(validateOtpDto)).rejects.toThrow(
          new CustomException(
            ErrorMessages.OTP.INVALID_OTP_CODE(),
            HttpStatus.UNAUTHORIZED,
          ),
        )
        expect(otpRepository.incrementAttempts).toHaveBeenCalledWith(
          invalidOtp.id,
        )
      })
    })
  })

  describe('getOtpStatus', () => {
    it('should return OTP status when found', async () => {
      const mockOtp = {
        id: 1,
        status: OtpStatus.PENDING,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      }

      otpRepository.findByHash.mockResolvedValue(mockOtp as OtpDto)

      const result = await service.getOtpStatus('hash123')

      expect(result).toEqual({
        status: mockOtp.status,
        expiresAt: mockOtp.expiresAt,
      })
    })

    it('should return null when OTP is not found', async () => {
      otpRepository.findByHash.mockResolvedValue(null)

      const result = await service.getOtpStatus('invalid-hash')

      expect(result).toBeNull()
    })
  })
})
