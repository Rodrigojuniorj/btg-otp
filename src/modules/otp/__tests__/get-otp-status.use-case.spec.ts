import { Test, TestingModule } from '@nestjs/testing'
import { GetOtpStatusUseCase } from '../application/use-cases/get-otp-status.use-case'
import { OtpRepositoryPort } from '../domain/repositories/otp.repository.port'
import { Otp } from '../domain/entities/otp.entity'
import { OtpPurpose, OtpStatus } from '../domain/enums/otp.enum'

describe('GetOtpStatusUseCase', () => {
  let useCase: GetOtpStatusUseCase
  let otpRepository: jest.Mocked<OtpRepositoryPort>

  const mockOtpRepository = {
    findByHash: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOtpStatusUseCase,
        {
          provide: OtpRepositoryPort,
          useValue: mockOtpRepository,
        },
      ],
    }).compile()

    useCase = module.get<GetOtpStatusUseCase>(GetOtpStatusUseCase)
    otpRepository = module.get(OtpRepositoryPort)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should return OTP status successfully', async () => {
      const request = {
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
        new Date(),
      )

      otpRepository.findByHash.mockResolvedValue(mockOtp)

      const result = await useCase.execute(request.hash)

      expect(result).toEqual({
        status: mockOtp.status,
        expiresAt: mockOtp.expiresAt,
      })

      expect(otpRepository.findByHash).toHaveBeenCalledWith(request.hash)
    })

    it('should throw error when OTP is not found', async () => {
      const request = {
        hash: 'nonexistent-hash',
      }

      otpRepository.findByHash.mockResolvedValue(null)

      const result = await useCase.execute(request.hash)
      expect(result).toBeNull()

      expect(otpRepository.findByHash).toHaveBeenCalledWith(request.hash)
    })
  })
})
