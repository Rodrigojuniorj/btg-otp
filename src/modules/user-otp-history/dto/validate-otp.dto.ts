import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ValidateOtpDto {
  @ApiProperty({
    description: 'Hash do OTP',
    example: 'abc123def456',
  })
  @IsString()
  @IsNotEmpty()
  hash: string

  @ApiProperty({
    description: 'Código OTP',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  otpCode: string
}
