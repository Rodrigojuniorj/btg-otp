import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { HttpStatus } from '@nestjs/common'

export const RegisterSwagger = {
  operation: ApiOperation({
    summary: 'Registrar novo usuário',
    description:
      'Cria um novo usuário no sistema com as informações fornecidas, a senha é criptografada.',
  }),

  response: ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuário criado com sucesso',
  }),

  badRequest: ApiResponse({
    status: 400,
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
  }),
}
