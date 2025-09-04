import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ValidateOtpDto {
  @ApiProperty({
    description: 'Código OTP para validação',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  otpCode: string

  @ApiProperty({
    description: 'Hash único do OTP',
    example: 'abc123def456',
  })
  @IsString()
  @IsNotEmpty()
  hash: string
}
