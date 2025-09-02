import { IsOptional, IsEmail, IsEnum, IsNotEmpty } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { OtpPurpose } from '../enums/otp.enum'

export class CreateOtpDto {
  @ApiPropertyOptional({
    description: 'Email do usuário para envio do OTP',
    example: 'usuario@exemplo.com',
    type: String,
  })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({
    description: 'Propósito do OTP',
    enum: OtpPurpose,
    example: OtpPurpose.VERIFICATION,
    default: OtpPurpose.GENERAL,
  })
  @IsNotEmpty()
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose
}
