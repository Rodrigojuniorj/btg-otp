import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger'
import { LoginOtpChallengeResponseDto } from '../dtos/login-otp-challenge-response.dto'

export const LoginSwagger = {
  operation: ApiOperation({
    summary: 'Realizar login e solicitar OTP',
    description:
      'Realiza o login do usuário e solicita um OTP para o email do usuário',
  }),

  response: ApiResponse({
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
  }),

  badRequest: ApiBadRequestResponse({
    description: 'Dados inválidos fornecidos',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Credenciais inválidas' },
        timestamp: { type: 'string', example: '2021-01-01T00:00:00.000Z' },
      },
    },
  }),
}
