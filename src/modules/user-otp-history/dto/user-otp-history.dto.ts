import { ApiProperty } from '@nestjs/swagger'
import {
  IsNumber,
  IsString,
  IsDate,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { UserOTPHistoryStatus } from '../enums/user-otp-history.enum'
import { UserResponseDto } from '@/modules/users/dto/user-response.dto'
import { Type } from 'class-transformer'

export class UserOtpHistoryDto {
  @ApiProperty({
    description: 'ID único do histórico OTP',
    example: 1,
    type: Number,
  })
  @IsNumber()
  id: number

  @ApiProperty({
    description: 'ID do usuário associado ao OTP',
    example: 1,
    type: Number,
  })
  @IsNumber()
  userId: number

  @ApiProperty({
    description: 'Hash único do OTP para validação',
    example: 'abc123def456ghi789',
    type: String,
    maxLength: 255,
  })
  @IsString()
  hash: string

  @ApiProperty({
    description: 'Código OTP gerado',
    example: '123456',
    type: String,
    maxLength: 100,
  })
  @IsString()
  otpCode: string

  @ApiProperty({
    description: 'Status atual do OTP',
    example: UserOTPHistoryStatus.PENDING,
    enum: UserOTPHistoryStatus,
    enumName: 'UserOTPHistoryStatus',
  })
  @IsEnum(UserOTPHistoryStatus)
  status: UserOTPHistoryStatus

  @ApiProperty({
    description: 'Data e hora em que o OTP foi enviado',
    example: '2025-01-01T12:00:00Z',
    type: Date,
  })
  @IsDate()
  sentAt: Date

  @ApiProperty({
    description: 'Data e hora em que o OTP foi validado (opcional)',
    example: '2025-01-01T12:05:00Z',
    type: Date,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  validatedAt?: Date

  @ApiProperty({
    description: 'Número de tentativas de validação',
    example: 0,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  attempts: number

  @ApiProperty({
    description: 'Data e hora de expiração do OTP',
    example: '2025-01-01T12:05:00Z',
    type: Date,
  })
  @IsDate()
  expiresAt: Date

  @ApiProperty({
    description: 'Data e hora de criação do registro',
    example: '2025-01-01T12:00:00Z',
    type: Date,
  })
  @IsDate()
  createdAt: Date

  @ApiProperty({
    description: 'Data e hora da última atualização do registro',
    example: '2025-01-01T12:00:00Z',
    type: Date,
  })
  @IsDate()
  updatedAt: Date

  @ApiProperty({
    description: 'Dados do usuário',
    type: UserResponseDto,
  })
  @ValidateNested()
  @Type(() => UserResponseDto)
  user: UserResponseDto
}
