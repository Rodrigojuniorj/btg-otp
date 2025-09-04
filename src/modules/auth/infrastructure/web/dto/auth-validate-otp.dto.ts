import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AuthValidateOtpDto {
  @ApiProperty({
    description: 'Código OTP para validação',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  otpCode: string
}
