import { ApiProperty } from '@nestjs/swagger'

export class OtpStatusResponseDto {
  @ApiProperty({
    description: 'Status atual do OTP',
    example: 'pending',
  })
  status: string

  @ApiProperty({
    description: 'Data de expiração do OTP',
    example: '2024-01-01T12:00:00.000Z',
  })
  expiresAt: Date
}
