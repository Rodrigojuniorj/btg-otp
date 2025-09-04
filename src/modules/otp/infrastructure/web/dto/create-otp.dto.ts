import { IsEmail, IsNotEmpty, IsOptional, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { OtpPurpose } from '../../../domain/enums/otp.enum'

export class CreateOtpDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    description: 'Propósito do OTP',
    enum: OtpPurpose,
    required: false,
    example: OtpPurpose.GENERAL,
  })
  @IsOptional()
  @IsEnum(OtpPurpose)
  purpose?: OtpPurpose
}
