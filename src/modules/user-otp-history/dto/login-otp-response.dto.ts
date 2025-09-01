import { ApiProperty } from '@nestjs/swagger'

export class LoginOtpResponseDto {
  @ApiProperty({
    description: 'Hash único para validação do OTP',
    example: 'abc123def456',
  })
  hash: string

  @ApiProperty({
    description: 'JWT temporário para validação do OTP',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  otpToken: string

  @ApiProperty({
    description: 'URL para validação do OTP',
    example: '/auth/validate-otp',
  })
  validationUrl: string

  @ApiProperty({
    description: 'Tempo de expiração em segundos',
    example: 300,
  })
  expiresIn: number

  @ApiProperty({
    description: 'Mensagem informativa',
    example: 'Código OTP enviado para seu email',
  })
  message: string
}
