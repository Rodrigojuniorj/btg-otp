import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common'
import { Response } from 'express'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
} from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'

import { Public } from '../../common/decorators/public.decorator'
import { OtpAuth } from '../../common/decorators/otp-auth.decorator'

import { LoginOtpChallengeResponseDto } from './dtos/login-otp-challenge-response.dto'
import { TaskType } from '@/common/enums/task-type.enum'
import { GetCurrentUserOtp } from '@/common/decorators/get-current-user-otp.decorator'
import { JwtOtpPayload } from '@/common/interfaces/jwt-otp-payload.interface'
import { AuthLoginValidateResponseDto } from './dtos/auth-login-validate-response.dto'
import { AuthValidateOtpDto } from './dtos/auth-validate-otp.dto'

@ApiTags('Autenticação')
@ApiBearerAuth('Bearer')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Realizar login e solicitar OTP' })
  @ApiResponse({
    status: 202,
    description:
      'Login realizado com sucesso, OTP solicitado e enviado por email',
    type: LoginOtpChallengeResponseDto,
    headers: {
      'x-task-type': {
        description: 'Tipo de tarefa pendente',
        schema: {
          type: 'string',
          example: 'otp-challenger',
        },
      },
    },
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginOtpChallengeResponseDto> {
    const loginOtpResponseDto = await this.authService.login(
      loginDto.email,
      loginDto.password,
    )

    res.setHeader('x-task-type', TaskType.OTP_CHALLENGER)

    return {
      message: 'Código OTP enviado para seu email',
      taskType: TaskType.OTP_CHALLENGER,
      accessToken: loginOtpResponseDto.accessToken,
      validationUrl: loginOtpResponseDto.validationUrl,
    }
  }

  @ApiOperation({
    summary: 'Registrar novo usuário',
    description:
      'Cria um novo usuário no sistema com as informações fornecidas, a senha é criptografada.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuário criado com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou usuário já existe',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          oneOf: [
            { type: 'string', example: 'Email já está em uso' },
            {
              type: 'array',
              items: { type: 'string' },
              example: ['Email deve ter um formato válido'],
            },
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<void> {
    await this.authService.register(registerDto)
  }

  @Post('validate-otp')
  @OtpAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validar código OTP',
    description:
      'Valida o código OTP enviado por email. Requer o token JWT temporário gerado no login.',
  })
  @ApiResponse({
    status: 200,
    description: 'OTP validado com sucesso, token de acesso gerado',
    type: AuthLoginValidateResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT inválido ou expirado',
  })
  async validateOtp(
    @Body() authValidateOtpDto: AuthValidateOtpDto,
    @GetCurrentUserOtp() userOtp: JwtOtpPayload,
  ): Promise<AuthLoginValidateResponseDto> {
    return this.authService.validate(authValidateOtpDto, userOtp)
  }
}
