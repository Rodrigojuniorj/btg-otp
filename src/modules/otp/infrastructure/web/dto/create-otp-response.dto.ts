import { ApiProperty } from '@nestjs/swagger'
import { OtpPurpose } from '../../../domain/enums/otp.enum'

export class CreateOtpResponseDto {
  @ApiProperty({
    description: 'Hash único do OTP',
    example: 'abc123def456',
  })
  hash: string

  @ApiProperty({
    description: 'Data de expiração do OTP',
    example: '2024-01-01T12:00:00.000Z',
  })
  expiresAt: Date

  @ApiProperty({
    description: 'Código OTP gerado',
    example: '123456',
  })
  otpCode: string

  @ApiProperty({
    description: 'Identificador do OTP (email)',
    example: 'usuario@exemplo.com',
  })
  identifier: string

  @ApiProperty({
    description: 'Propósito do OTP',
    enum: OtpPurpose,
    example: OtpPurpose.GENERAL,
  })
  purpose: OtpPurpose
}
