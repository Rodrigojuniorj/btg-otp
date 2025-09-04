import { OtpEntity } from './otp.entity'
import { Otp } from '../../domain/entities/otp.entity'

export class OtpMapper {
  static toDomain(entity: OtpEntity): Otp {
    return new Otp(
      entity.id,
      entity.hash,
      entity.otpCode,
      entity.identifier,
      entity.purpose,
      entity.status,
      entity.attempts,
      entity.expiresAt,
      entity.createdAt,
      entity.updatedAt,
      entity.validatedAt,
    )
  }

  static toEntity(domain: Otp): Partial<OtpEntity> {
    return {
      id: domain.id,
      hash: domain.hash,
      otpCode: domain.otpCode,
      identifier: domain.identifier,
      purpose: domain.purpose,
      status: domain.status,
      attempts: domain.attempts,
      expiresAt: domain.expiresAt,
      validatedAt: domain.validatedAt,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    }
  }
}
