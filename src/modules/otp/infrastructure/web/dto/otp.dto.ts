import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { OtpStatus, OtpPurpose } from '../../../domain/enums/otp.enum'

export class OtpDto {
  @ApiProperty({
    description: 'ID único do OTP',
    example: 1,
    type: Number,
  })
  id: number

  @ApiProperty({
    description: 'Hash único do OTP para validação',
    example: 'abc123def456ghi789',
    type: String,
  })
  hash: string

  @ApiProperty({
    description: 'Código OTP de 6 dígitos',
    example: '123456',
    type: String,
    minLength: 6,
    maxLength: 6,
  })
  otpCode: string

  @ApiProperty({
    description: 'Identificador usado para criar o OTP (email, telefone, etc.)',
    example: 'usuario@exemplo.com',
    type: String,
  })
  identifier: string

  @ApiProperty({
    description: 'Propósito do OTP',
    enum: OtpPurpose,
    example: OtpPurpose.VERIFICATION,
    type: String,
  })
  purpose: OtpPurpose

  @ApiProperty({
    description: 'Status atual do OTP',
    enum: OtpStatus,
    example: OtpStatus.PENDING,
    type: String,
  })
  status: OtpStatus

  @ApiProperty({
    description: 'Número de tentativas de validação',
    example: 0,
    type: Number,
    minimum: 0,
    maximum: 3,
  })
  attempts: number

  @ApiProperty({
    description: 'Data e hora de expiração do OTP',
    example: '2024-01-15T10:30:00.000Z',
    type: Date,
  })
  expiresAt: Date

  @ApiPropertyOptional({
    description: 'Data e hora da validação (se validado)',
    example: '2024-01-15T10:25:00.000Z',
    type: Date,
    nullable: true,
  })
  validatedAt?: Date

  @ApiProperty({
    description: 'Data e hora de criação do OTP',
    example: '2024-01-15T10:20:00.000Z',
    type: Date,
  })
  createdAt: Date

  @ApiProperty({
    description: 'Data e hora da última atualização do OTP',
    example: '2024-01-15T10:20:00.000Z',
    type: Date,
  })
  updatedAt: Date
}
