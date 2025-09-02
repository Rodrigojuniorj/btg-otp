import { HttpStatus, Injectable } from '@nestjs/common'
import { UserOtpHistoryRepositoryPort } from './repositories/port/user-otp-history.repository.port'
import { CreateUserOtpHistoryDto } from './dto/create-user-otp-history.dto'
import { UserOTPHistoryStatus } from './enums/user-otp-history.enum'
import { generateOtpCode } from '@/common/utils/generate-otp-code.util'
import { generateUniqueHash } from '@/common/utils/generate-unique-hash.util'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { CreateUserOtpHistoryResponseDto } from './dto/create-user-otp-history-response.dto'
import { ValidateOtpDto } from './dto/validate-otp.dto'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { UserOtpHistoryDto } from './dto/user-otp-history.dto'

@Injectable()
export class UserOtpHistoryService {
  constructor(
    private readonly userOtpHistoryRepository: UserOtpHistoryRepositoryPort,
    private readonly envConfigService: EnvConfigService,
  ) {}

  async expireOldOtps(userId: number) {
    return await this.userOtpHistoryRepository.expireOldOtps(userId)
  }

  async create(userId: number): Promise<CreateUserOtpHistoryResponseDto> {
    const otpCode = generateOtpCode(this.envConfigService.get('OTP_LENGTH'))
    const hash = generateUniqueHash()
    const expiresAt = new Date(
      Date.now() + this.envConfigService.get('OTP_MINUTE_DURATION') * 60 * 1000,
    )

    const createOtpDto: CreateUserOtpHistoryDto = {
      userId,
      hash,
      otpCode,
      expiresAt,
    }

    await this.userOtpHistoryRepository.create(createOtpDto)

    return { hash, expiresAt, otpCode }
  }

  async findByHash(hash: string) {
    return await this.userOtpHistoryRepository.findByHash(hash)
  }

  async updateStatus(id: number, status: UserOTPHistoryStatus) {
    return await this.userOtpHistoryRepository.updateStatus(id, status)
  }

  async incrementAttempts(id: number) {
    return await this.userOtpHistoryRepository.incrementAttempts(id)
  }

  async findPendingByUserId(userId: number) {
    return await this.userOtpHistoryRepository.findPendingByUserId(userId)
  }

  async validateOtp(
    validateOtpDto: ValidateOtpDto,
    hash: string,
  ): Promise<UserOtpHistoryDto> {
    const { otpCode } = validateOtpDto

    const otpHistory = await this.userOtpHistoryRepository.findByHash(hash)

    if (!otpHistory) {
      throw new CustomException(
        ErrorMessages.USER_OTP_HISTORY.INVALID_OTP(),
        HttpStatus.UNAUTHORIZED,
      )
    }

    if (otpHistory.expiresAt < new Date()) {
      await this.userOtpHistoryRepository.updateStatus(
        otpHistory.id,
        UserOTPHistoryStatus.EXPIRED,
      )

      throw new CustomException(
        ErrorMessages.USER_OTP_HISTORY.OTP_EXPIRED(),
        HttpStatus.UNAUTHORIZED,
      )
    }

    if (otpHistory.status !== UserOTPHistoryStatus.PENDING) {
      throw new CustomException(
        ErrorMessages.USER_OTP_HISTORY.OTP_USED(),
        HttpStatus.UNAUTHORIZED,
      )
    }

    if (otpHistory.otpCode !== otpCode) {
      await this.userOtpHistoryRepository.incrementAttempts(otpHistory.id)
      throw new CustomException(
        ErrorMessages.USER_OTP_HISTORY.INVALID_OTP_CODE(),
        HttpStatus.UNAUTHORIZED,
      )
    }

    await this.userOtpHistoryRepository.updateStatus(
      otpHistory.id,
      UserOTPHistoryStatus.VALIDATED,
    )

    return otpHistory
  }
}
