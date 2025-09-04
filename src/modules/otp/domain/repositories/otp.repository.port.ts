import { Otp } from '../entities/otp.entity'
import { OtpPurpose, OtpStatus } from '../enums/otp.enum'

export abstract class OtpRepositoryPort {
  abstract create(otp: Otp): Promise<Otp>

  abstract findByHash(hash: string): Promise<Otp | null>

  abstract findActiveByIdentifier(identifier: string): Promise<Otp | null>

  abstract updateStatus(id: number, status: OtpStatus): Promise<void>

  abstract incrementAttempts(id: number): Promise<void>

  abstract expireOldOtps(identifier: string, purpose: OtpPurpose): Promise<void>

  abstract deleteExpiredOtps(): Promise<void>
}
