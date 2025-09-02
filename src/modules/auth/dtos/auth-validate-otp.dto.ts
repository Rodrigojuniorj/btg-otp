import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AuthValidateOtpDto {
  @ApiProperty({
    description: 'Código OTP de 6 dígitos enviado por email',
    example: '123456',
    type: String,
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  otpCode: string
}
