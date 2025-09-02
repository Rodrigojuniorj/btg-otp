import { OtpDto } from '../../dto/otp.dto'
import { OtpPurpose, OtpStatus } from '../../enums/otp.enum'

export abstract class OtpRepositoryPort {
  abstract create(otpData: Partial<OtpDto>): Promise<OtpDto>

  abstract findByHash(hash: string): Promise<OtpDto | null>

  abstract findActiveByIdentifier(identifier: string): Promise<OtpDto | null>

  abstract updateStatus(id: number, status: OtpStatus): Promise<void>

  abstract incrementAttempts(id: number): Promise<void>

  abstract expireOldOtps(identifier: string, purpose: OtpPurpose): Promise<void>

  abstract deleteExpiredOtps(): Promise<void>
}
