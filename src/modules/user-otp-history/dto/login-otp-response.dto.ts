import { ApiProperty } from '@nestjs/swagger'

export class LoginOtpResponseDto {
  @ApiProperty({
    description: 'Hash único do OTP para validação',
    example: 'abc123def456',
  })
  hash: string

  @ApiProperty({
    description: 'JWT temporário para validação do OTP',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string

  @ApiProperty({
    description: 'URL para validação do OTP',
    example: '/auth/validate-otp',
  })
  validationUrl: string
}
