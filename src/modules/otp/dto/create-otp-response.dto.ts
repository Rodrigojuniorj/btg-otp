import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateOtpResponseDto {
  @ApiProperty({
    description: 'Hash único do OTP para validação',
    example: 'abc123def456ghi789',
    type: String,
  })
  hash: string

  @ApiProperty({
    description: 'Data e hora de expiração do OTP',
    example: '2024-01-15T10:30:00.000Z',
    type: Date,
  })
  expiresAt: Date

  @ApiProperty({
    description: 'Código OTP de 6 dígitos',
    example: '123456',
    type: String,
    minLength: 6,
    maxLength: 6,
  })
  otpCode: string

  @ApiPropertyOptional({
    description: 'Identificador usado para criar o OTP (email, telefone, etc.)',
    example: 'usuario@exemplo.com',
    type: String,
  })
  identifier?: string

  @ApiPropertyOptional({
    description: 'Propósito do OTP',
    example: 'verification',
    type: String,
  })
  purpose?: string
}
