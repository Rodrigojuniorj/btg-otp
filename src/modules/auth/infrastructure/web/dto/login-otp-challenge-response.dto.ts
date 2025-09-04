import { ApiProperty } from '@nestjs/swagger'

export class LoginOtpChallengeResponseDto {
  @ApiProperty({
    description: 'Mensagem de resposta',
    example: 'Código OTP enviado para seu email',
  })
  message: string

  @ApiProperty({
    description: 'Tipo de tarefa',
    example: 'OTP_CHALLENGER',
  })
  taskType: string

  @ApiProperty({
    description: 'Token de acesso temporário',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string

  @ApiProperty({
    description: 'URL para validação do OTP',
    example: '/auth/validate-otp/abc123',
  })
  validationUrl: string
}
