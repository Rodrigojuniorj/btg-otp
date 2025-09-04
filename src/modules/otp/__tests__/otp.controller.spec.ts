import { Test, TestingModule } from '@nestjs/testing'
import { OtpController } from '../infrastructure/web/otp.controller'
import { CreateOtpUseCase } from '../application/use-cases/create-otp.use-case'
import { ValidateOtpUseCase } from '../application/use-cases/validate-otp.use-case'
import { GetOtpStatusUseCase } from '../application/use-cases/get-otp-status.use-case'
import { OtpPurpose, OtpStatus } from '../domain/enums/otp.enum'
import { CustomException } from '@/common/exceptions/customException'
import { HttpStatus } from '@nestjs/common'
import { CreateOtpDto } from '../infrastructure/web/dto/create-otp.dto'
import { ValidateOtpDto } from '../infrastructure/web/dto/validate-otp.dto'

describe('OtpController', () => {
  let controller: OtpController
  let createOtpUseCase: jest.Mocked<CreateOtpUseCase>
  let validateOtpUseCase: jest.Mocked<ValidateOtpUseCase>
  let getOtpStatusUseCase: jest.Mocked<GetOtpStatusUseCase>

  const mockCreateOtpUseCase = {
    execute: jest.fn(),
  }

  const mockValidateOtpUseCase = {
    execute: jest.fn(),
  }

  const mockGetOtpStatusUseCase = {
    execute: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtpController],
      providers: [
        {
          provide: CreateOtpUseCase,
          useValue: mockCreateOtpUseCase,
        },
        {
          provide: ValidateOtpUseCase,
          useValue: mockValidateOtpUseCase,
        },
        {
          provide: GetOtpStatusUseCase,
          useValue: mockGetOtpStatusUseCase,
        },
      ],
    }).compile()

    controller = module.get<OtpController>(OtpController)
    createOtpUseCase = module.get(CreateOtpUseCase)
    validateOtpUseCase = module.get(ValidateOtpUseCase)
    getOtpStatusUseCase = module.get(GetOtpStatusUseCase)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('createOtp', () => {
    it('should create OTP successfully', async () => {
      const createOtpDto: CreateOtpDto = {
        email: 'test@example.com',
        purpose: OtpPurpose.GENERAL,
      }

      const expectedResponse = {
        hash: 'test-hash',
        expiresAt: new Date(),
        otpCode: '123456',
        identifier: 'test@example.com',
        purpose: OtpPurpose.GENERAL,
      }

      createOtpUseCase.execute.mockResolvedValue(expectedResponse)

      const result = await controller.createOtp(createOtpDto)

      expect(createOtpUseCase.execute).toHaveBeenCalledWith({
        email: createOtpDto.email,
        purpose: createOtpDto.purpose,
      })
      expect(result).toEqual(expectedResponse)
    })

    it('should handle service errors properly', async () => {
      const createOtpDto: CreateOtpDto = {
        email: 'test@example.com',
        purpose: OtpPurpose.GENERAL,
      }

      const error = new CustomException('Error message', HttpStatus.BAD_REQUEST)
      createOtpUseCase.execute.mockRejectedValue(error)

      await expect(controller.createOtp(createOtpDto)).rejects.toThrow(error)
    })
  })

  describe('validateOtp', () => {
    it('should validate OTP successfully', async () => {
      const validateOtpDto: ValidateOtpDto = {
        otpCode: '123456',
        hash: 'test-hash',
      }

      validateOtpUseCase.execute.mockResolvedValue(undefined)

      const result = await controller.validateOtp(validateOtpDto)

      expect(validateOtpUseCase.execute).toHaveBeenCalledWith({
        otpCode: validateOtpDto.otpCode,
        hash: validateOtpDto.hash,
      })
      expect(result).toEqual({
        message: 'OTP validado com sucesso',
      })
    })

    it('should handle validation errors properly', async () => {
      const validateOtpDto: ValidateOtpDto = {
        otpCode: '123456',
        hash: 'test-hash',
      }

      const error = new CustomException('Invalid OTP', HttpStatus.UNAUTHORIZED)
      validateOtpUseCase.execute.mockRejectedValue(error)

      await expect(controller.validateOtp(validateOtpDto)).rejects.toThrow(
        error,
      )
    })
  })

  describe('getOtpStatus', () => {
    it('should return OTP status when found', async () => {
      const hash = 'test-hash'
      const expectedStatus = {
        status: OtpStatus.PENDING,
        expiresAt: new Date(),
      }

      getOtpStatusUseCase.execute.mockResolvedValue(expectedStatus)

      const result = await controller.getOtpStatus(hash)

      expect(getOtpStatusUseCase.execute).toHaveBeenCalledWith(hash)
      expect(result).toEqual(expectedStatus)
    })

    it('should return not found message when OTP is not found', async () => {
      const hash = 'test-hash'

      getOtpStatusUseCase.execute.mockResolvedValue(null)

      const result = await controller.getOtpStatus(hash)

      expect(getOtpStatusUseCase.execute).toHaveBeenCalledWith(hash)
      expect(result).toEqual({ message: 'OTP não encontrado' })
    })

    it('should handle service errors properly', async () => {
      const hash = 'test-hash'
      const error = new CustomException(
        'Database error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
      getOtpStatusUseCase.execute.mockRejectedValue(error)

      await expect(controller.getOtpStatus(hash)).rejects.toThrow(error)
    })
  })

  describe('controller metadata', () => {
    it('should have correct route decorators', () => {
      const controllerMetadata = Reflect.getMetadata('path', OtpController)
      expect(controllerMetadata).toBe('otp')
    })

    it('should have correct HTTP methods', () => {
      const createMethodMetadata = Reflect.getMetadata(
        'method',
        controller.createOtp,
      )
      const validateMethodMetadata = Reflect.getMetadata(
        'method',
        controller.validateOtp,
      )
      const statusMethodMetadata = Reflect.getMetadata(
        'method',
        controller.getOtpStatus,
      )

      expect(createMethodMetadata).toBe(1)
      expect(validateMethodMetadata).toBe(1)
      expect(statusMethodMetadata).toBe(0)
    })
  })
})
