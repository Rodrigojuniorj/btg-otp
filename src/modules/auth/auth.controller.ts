import { Controller, Post, Body, HttpStatus } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
} from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { RegisterDto } from './dtos/register.dto'

import { Public } from '../../common/decorators/public.decorator'

@ApiTags('Autenticação')
@ApiBearerAuth('Bearer')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
