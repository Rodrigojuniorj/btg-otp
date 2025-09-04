import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { UserResponseDto } from '../dto/user-response.dto'

export const ProfileSwagger = {
  operation: ApiOperation({
    summary: 'Obter perfil do usuário',
    description: 'Obtém o perfil do usuário autenticado',
  }),

  response: ApiResponse({
    status: 200,
    description: 'Perfil do usuário obtido com sucesso',
    type: UserResponseDto,
  }),
}
