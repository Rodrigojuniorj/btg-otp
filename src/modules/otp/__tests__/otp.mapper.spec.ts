import { OtpMapper } from '../infrastructure/database/otp.mapper'
import { Otp } from '../domain/entities/otp.entity'
import { OtpEntity } from '../infrastructure/database/otp.entity'
import { OtpPurpose, OtpStatus } from '../domain/enums/otp.enum'

describe('OtpMapper', () => {
  describe('toDomain', () => {
    it('should convert OtpEntity to Otp domain entity', () => {
      const otpEntity = new OtpEntity()
      otpEntity.id = 1
      otpEntity.identifier = 'test@example.com'
      otpEntity.hash = 'hash123'
      otpEntity.otpCode = '123456'
      otpEntity.purpose = OtpPurpose.GENERAL
      otpEntity.status = OtpStatus.PENDING
      otpEntity.attempts = 0
      otpEntity.createdAt = new Date('2023-01-01T00:00:00Z')
      otpEntity.expiresAt = new Date('2023-01-01T00:05:00Z')
      otpEntity.updatedAt = new Date('2023-01-01T00:00:00Z')

      const result = OtpMapper.toDomain(otpEntity)

      expect(result).toBeInstanceOf(Otp)
      expect(result.id).toBe(otpEntity.id)
      expect(result.identifier).toBe(otpEntity.identifier)
      expect(result.hash).toBe(otpEntity.hash)
      expect(result.otpCode).toBe(otpEntity.otpCode)
      expect(result.purpose).toBe(otpEntity.purpose)
      expect(result.status).toBe(otpEntity.status)
      expect(result.attempts).toBe(otpEntity.attempts)
      expect(result.createdAt).toBe(otpEntity.createdAt)
      expect(result.expiresAt).toBe(otpEntity.expiresAt)
      expect(result.updatedAt).toBe(otpEntity.updatedAt)
    })
  })

  describe('toEntity', () => {
    it('should convert Otp domain entity to OtpEntity', () => {
      const otp = new Otp(
        1,
        'hash123',
        '123456',
        'test@example.com',
        OtpPurpose.GENERAL,
        OtpStatus.PENDING,
        0,
        new Date('2023-01-01T00:05:00Z'),
        new Date('2023-01-01T00:00:00Z'),
        new Date('2023-01-01T00:00:00Z'),
      )

      const result = OtpMapper.toEntity(otp)

      expect(result).toEqual({
        id: otp.id,
        identifier: otp.identifier,
        hash: otp.hash,
        otpCode: otp.otpCode,
        purpose: otp.purpose,
        status: otp.status,
        attempts: otp.attempts,
        createdAt: otp.createdAt,
        expiresAt: otp.expiresAt,
        updatedAt: otp.updatedAt,
      })
    })
  })
})
