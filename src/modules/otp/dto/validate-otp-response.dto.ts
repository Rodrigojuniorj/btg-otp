import { ApiProperty } from '@nestjs/swagger'

export class ValidateOtpResponseDto {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'OTP validado com sucesso',
    type: String,
  })
  message: string

  @ApiProperty({
    description: 'Identificador usado no OTP',
    example: 'usuario@exemplo.com',
    type: String,
  })
  identifier: string

  @ApiProperty({
    description: 'Propósito do OTP',
    example: 'verification',
    type: String,
  })
  purpose: string

  @ApiProperty({
    description: 'Data e hora da validação',
    example: '2024-01-15T10:25:00.000Z',
    type: Date,
  })
  validatedAt: Date
}
