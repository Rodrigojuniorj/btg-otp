import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ValidateOtpDto {
  @ApiProperty({
    description: 'Código OTP',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  otpCode: string
}
