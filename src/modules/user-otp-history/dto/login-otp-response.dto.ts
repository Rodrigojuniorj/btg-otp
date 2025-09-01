import { ApiProperty } from '@nestjs/swagger'

export class LoginOtpResponseDto {
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
