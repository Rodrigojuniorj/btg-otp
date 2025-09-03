import { ApiProperty } from '@nestjs/swagger'

export class AuthLoginResponseDto {
  @ApiProperty({
    description: 'Token JWT para autenticação',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string

  @ApiProperty({
    description: 'URL para validação do OTP',
    example: '/auth/validate-otp/abc123def456',
  })
  validationUrl: string
}
