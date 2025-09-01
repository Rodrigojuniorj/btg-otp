import { ApiProperty } from '@nestjs/swagger'

export class CreateUserOtpHistoryResponseDto {
  @ApiProperty({
    description: 'Hash único do OTP',
    example: 'abc123def456',
  })
  hash: string

  @ApiProperty({
    description: 'Data de expiração',
    example: '2025-01-01T12:00:00Z',
  })
  expiresAt: Date
}
