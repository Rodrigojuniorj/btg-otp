import { Test, TestingModule } from '@nestjs/testing'
import { OtpController } from '../infrastructure/web/otp.controller'
import { CreateOtpUseCase } from '../application/use-cases/create-otp.use-case'
import { ValidateOtpUseCase } from '../application/use-cases/validate-otp.use-case'
import { GetOtpStatusUseCase } from '../application/use-cases/get-otp-status.use-case'
import { CreateOtpDto } from '../infrastructure/web/dto/create-otp.dto'
import { OtpPurpose } from '../domain/enums/otp.enum'
import { CustomException } from '@/common/exceptions/customException'
import { HttpStatus } from '@nestjs/common'

describe('OtpController', () => {
  let controller: OtpController
  let createOtpUseCase: jest.Mocked<CreateOtpUseCase>

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
})
