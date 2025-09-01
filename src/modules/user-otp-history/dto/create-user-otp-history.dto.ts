import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator'

export class CreateUserOtpHistoryDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number

  @ApiProperty({
    description: 'Hash único do OTP',
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

  @ApiProperty({
    description: 'Data de expiração',
    example: '2025-01-01T12:00:00Z',
  })
  @IsDate()
  expiresAt: Date
}
