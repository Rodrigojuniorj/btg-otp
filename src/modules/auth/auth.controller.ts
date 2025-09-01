import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'

import { Public } from '../../common/decorators/public.decorator'
import { AuthLoginResponseDto } from './dtos/auth-login-response.dto'

@ApiTags('Autenticação')
@ApiBearerAuth('Bearer')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiOperation({
    summary: 'Fazer login no sistema',
    description:
      'Autentica um usuário no sistema e retorna um token JWT válido',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login realizado com sucesso',
    type: AuthLoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Credenciais inválidas' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthLoginResponseDto> {
    return this.authService.login(loginDto)
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
}
