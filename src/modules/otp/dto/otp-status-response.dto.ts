import { ApiProperty } from '@nestjs/swagger'

export class OtpStatusResponseDto {
  @ApiProperty({
    description: 'Status atual do OTP',
    example: 'pending',
    enum: ['pending', 'validated', 'expired', 'failed'],
    type: String,
  })
  status: string

  @ApiProperty({
    description: 'Data e hora de expiração do OTP',
    example: '2024-01-15T10:30:00.000Z',
    type: Date,
  })
  expiresAt: Date
}

export class OtpNotFoundResponseDto {
  @ApiProperty({
    description: 'Mensagem de erro',
    example: 'OTP não encontrado',
    type: String,
  })
  message: string
}
