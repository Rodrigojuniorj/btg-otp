import { ApiProperty } from '@nestjs/swagger'

export class ValidateOtpResponseDto {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'OTP validado com sucesso',
  })
  message: string
}
