import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger'
import { OtpService } from './otp.service'
import { CreateOtpDto } from './dto/create-otp.dto'
import { CreateOtpResponseDto } from './dto/create-otp-response.dto'

import { Public } from '@/common/decorators/public.decorator'

@ApiTags('OTP')
@Controller('otp')
@Public()
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @ApiOperation({
    summary: 'Criar novo OTP',
    description: 'Gera um novo código OTP para verificação ou autenticação',
  })
  @ApiBody({ type: CreateOtpDto })
  @ApiCreatedResponse({
    description: 'OTP criado com sucesso',
    type: CreateOtpResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos fornecidos',
  })
  @ApiConflictResponse({
    description: 'Já existe um OTP ativo para este identificador',
  })
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createOtp(@Body() createOtpDto: CreateOtpDto) {
    return this.otpService.create(createOtpDto)
  }
}
