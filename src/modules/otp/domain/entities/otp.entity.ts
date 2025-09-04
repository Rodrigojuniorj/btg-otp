import { OtpPurpose, OtpStatus } from '../enums/otp.enum'

export class Otp {
  constructor(
    public readonly id: number,
    public readonly hash: string,
    public readonly otpCode: string,
    public readonly identifier: string,
    public readonly purpose: OtpPurpose,
    public readonly status: OtpStatus,
    public readonly attempts: number,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly validatedAt?: Date,
  ) {}

  isExpired(): boolean {
    return this.expiresAt < new Date()
  }

  isNotExpired(): boolean {
    return this.expiresAt > new Date()
  }

  canBeValidated(): boolean {
    return this.status === OtpStatus.PENDING && !this.isExpired()
  }

  isMaxAttemptsReached(maxAttempts: number): boolean {
    return this.attempts >= maxAttempts
  }

  isUsed(): boolean {
    return this.status === OtpStatus.VALIDATED
  }

  isFailed(): boolean {
    return this.status === OtpStatus.FAILED
  }

  isExpiredStatus(): boolean {
    return this.status === OtpStatus.EXPIRED
  }

  static create(
    hash: string,
    otpCode: string,
    identifier: string,
    purpose: OtpPurpose,
    expiresAt: Date,
  ): Otp {
    const now = new Date()
    return new Otp(
      0,
      hash,
      otpCode,
      identifier,
      purpose,
      OtpStatus.PENDING,
      0,
      expiresAt,
      now,
      now,
    )
  }

  markAsValidated(): Otp {
    return new Otp(
      this.id,
      this.hash,
      this.otpCode,
      this.identifier,
      this.purpose,
      OtpStatus.VALIDATED,
      this.attempts,
      this.expiresAt,
      this.createdAt,
      new Date(),
      new Date(),
    )
  }

  incrementAttempts(): Otp {
    return new Otp(
      this.id,
      this.hash,
      this.otpCode,
      this.identifier,
      this.purpose,
      this.status,
      this.attempts + 1,
      this.expiresAt,
      this.createdAt,
      new Date(),
      this.validatedAt,
    )
  }

  markAsExpired(): Otp {
    return new Otp(
      this.id,
      this.hash,
      this.otpCode,
      this.identifier,
      this.purpose,
      OtpStatus.EXPIRED,
      this.attempts,
      this.expiresAt,
      this.createdAt,
      new Date(),
      this.validatedAt,
    )
  }

  markAsFailed(): Otp {
    return new Otp(
      this.id,
      this.hash,
      this.otpCode,
      this.identifier,
      this.purpose,
      OtpStatus.FAILED,
      this.attempts,
      this.expiresAt,
      this.createdAt,
      new Date(),
      this.validatedAt,
    )
  }
}
