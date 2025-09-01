import { CreateUserOtpHistoryDto } from '../../dto/create-user-otp-history.dto'
import { UserOtpHistoryDto } from '../../dto/user-otp-history.dto'
import { UserOTPHistoryStatus } from '../../enums/user-otp-history.enum'

export abstract class UserOtpHistoryRepositoryPort {
  abstract create(
    createUserOtpHistoryDto: CreateUserOtpHistoryDto,
  ): Promise<UserOtpHistoryDto>

  abstract findByHash(hash: string): Promise<UserOtpHistoryDto | null>

  abstract updateStatus(id: number, status: UserOTPHistoryStatus): Promise<void>

  abstract incrementAttempts(id: number): Promise<void>

  abstract findPendingByUserId(
    userId: number,
  ): Promise<UserOtpHistoryDto | null>

  abstract expireOldOtps(userId: number): Promise<void>
}
