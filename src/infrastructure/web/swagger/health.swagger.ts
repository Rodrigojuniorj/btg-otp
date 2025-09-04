import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export const HealthSwagger = {
  operation: ApiOperation({
    summary: 'Health check',
    description: 'Verifica a saúde da aplicação',
  }),

  response: ApiResponse({
    status: 200,
    description: 'Aplicação está saudável',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'UP' },
      },
    },
  }),

  error: ApiResponse({
    status: 500,
    description: 'Aplicação está com problemas',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'DOWN' },
      },
    },
  }),
}
