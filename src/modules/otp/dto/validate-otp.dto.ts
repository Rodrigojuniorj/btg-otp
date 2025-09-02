import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ValidateOtpDto {
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

  @ApiProperty({
    description: 'Hash único do OTP gerado na criação',
    example: 'abc123def456ghi789',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  hash: string
}
