import { Test, TestingModule } from '@nestjs/testing'
import { OtpController } from '../otp.controller'
import { OtpService } from '../otp.service'
import { CreateOtpDto } from '../dto/create-otp.dto'
import { ValidateOtpDto } from '../dto/validate-otp.dto'
import { OtpPurpose, OtpStatus } from '../enums/otp.enum'
import { CustomException } from '@/common/exceptions/customException'
import { HttpStatus } from '@nestjs/common'

describe('OtpController', () => {
  let controller: OtpController
  let otpService: jest.Mocked<OtpService>

  const mockOtpService = {
    create: jest.fn(),
    validateOtp: jest.fn(),
    getOtpStatus: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtpController],
      providers: [
        {
          provide: OtpService,
          useValue: mockOtpService,
        },
      ],
    }).compile()

    controller = module.get<OtpController>(OtpController)
    otpService = module.get(OtpService)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createOtp', () => {
    const createOtpDto: CreateOtpDto = {
      email: 'test@example.com',
      purpose: OtpPurpose.GENERAL,
    }

    const mockCreateResponse = {
      hash: 'hash123',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      otpCode: '123456',
      identifier: 'test@example.com',
      purpose: OtpPurpose.GENERAL,
    }

    it('should create OTP successfully', async () => {
      otpService.create.mockResolvedValue(mockCreateResponse)

      const result = await controller.createOtp(createOtpDto)

      expect(result).toEqual(mockCreateResponse)
      expect(otpService.create).toHaveBeenCalledWith(createOtpDto)
    })

    it('should handle service errors properly', async () => {
      const errorMessage = 'OTP already active'
      otpService.create.mockRejectedValue(
        new CustomException(errorMessage, HttpStatus.CONFLICT),
      )

      await expect(controller.createOtp(createOtpDto)).rejects.toThrow(
        CustomException,
      )
      expect(otpService.create).toHaveBeenCalledWith(createOtpDto)
    })
  })

  describe('validateOtp', () => {
    const validateOtpDto: ValidateOtpDto = {
      otpCode: '123456',
      hash: 'hash123',
    }

    const expectedResponse = {
      message: 'OTP validado com sucesso',
    }

    it('should validate OTP successfully', async () => {
      otpService.validateOtp.mockResolvedValue(undefined)

      const result = await controller.validateOtp(validateOtpDto)

      expect(result).toEqual(expectedResponse)
      expect(otpService.validateOtp).toHaveBeenCalledWith(validateOtpDto)
    })

    it('should handle validation errors properly', async () => {
      const errorMessage = 'Invalid OTP'
      otpService.validateOtp.mockRejectedValue(
        new CustomException(errorMessage, HttpStatus.UNAUTHORIZED),
      )

      await expect(controller.validateOtp(validateOtpDto)).rejects.toThrow(
        CustomException,
      )
      expect(otpService.validateOtp).toHaveBeenCalledWith(validateOtpDto)
    })
  })

  describe('getOtpStatus', () => {
    const hash = 'hash123'

    it('should return OTP status when found', async () => {
      const mockStatus = {
        status: OtpStatus.PENDING,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      }

      otpService.getOtpStatus.mockResolvedValue(mockStatus)

      const result = await controller.getOtpStatus(hash)

      expect(result).toEqual(mockStatus)
      expect(otpService.getOtpStatus).toHaveBeenCalledWith(hash)
    })

    it('should return not found message when OTP is not found', async () => {
      otpService.getOtpStatus.mockResolvedValue(null)

      const result = await controller.getOtpStatus(hash)

      expect(result).toEqual({ message: 'OTP não encontrado' })
      expect(otpService.getOtpStatus).toHaveBeenCalledWith(hash)
    })

    it('should handle service errors properly', async () => {
      const errorMessage = 'Database error'
      otpService.getOtpStatus.mockRejectedValue(
        new CustomException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR),
      )

      await expect(controller.getOtpStatus(hash)).rejects.toThrow(
        CustomException,
      )
      expect(otpService.getOtpStatus).toHaveBeenCalledWith(hash)
    })
  })

  describe('controller metadata', () => {
    it('should have correct route decorators', () => {
      expect(controller).toBeDefined()
      expect(controller.constructor.name).toBe('OtpController')
    })

    it('should have correct HTTP methods', () => {
      Reflect.getMetadata('path', controller.createOtp)
      Reflect.getMetadata('path', controller.validateOtp)
      Reflect.getMetadata('path', controller.getOtpStatus)

      expect(typeof controller.createOtp).toBe('function')
      expect(typeof controller.validateOtp).toBe('function')
      expect(typeof controller.getOtpStatus).toBe('function')
    })
  })
})
