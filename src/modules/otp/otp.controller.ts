import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger'
import { OtpService } from './otp.service'
import { CreateOtpDto } from './dto/create-otp.dto'
import { ValidateOtpDto } from './dto/validate-otp.dto'
import { CreateOtpResponseDto } from './dto/create-otp-response.dto'
import { ValidateOtpResponseDto } from './dto/validate-otp-response.dto'
import {
  OtpStatusResponseDto,
  OtpNotFoundResponseDto,
} from './dto/otp-status-response.dto'
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

  @ApiOperation({
    summary: 'Validar OTP',
    description: 'Valida um código OTP usando o hash e código fornecidos',
  })
  @ApiBody({ type: ValidateOtpDto })
  @ApiOkResponse({
    description: 'OTP validado com sucesso',
    type: ValidateOtpResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'OTP inválido, expirado ou já utilizado',
  })
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateOtp(@Body() validateOtpDto: ValidateOtpDto) {
    await this.otpService.validateOtp(validateOtpDto)

    return {
      message: 'OTP validado com sucesso',
    }
  }

  @ApiOperation({
    summary: 'Verificar status do OTP',
    description: 'Retorna o status atual e data de expiração de um OTP',
  })
  @ApiParam({
    name: 'hash',
    description: 'Hash único do OTP',
    example: 'abc123def456ghi789',
  })
  @ApiOkResponse({
    description: 'Status do OTP encontrado',
    type: OtpStatusResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'OTP não encontrado',
    type: OtpNotFoundResponseDto,
  })
  @Get('status/:hash')
  async getOtpStatus(@Param('hash') hash: string) {
    const status = await this.otpService.getOtpStatus(hash)

    if (!status) {
      return { message: 'OTP não encontrado' }
    }

    return status
  }
}
