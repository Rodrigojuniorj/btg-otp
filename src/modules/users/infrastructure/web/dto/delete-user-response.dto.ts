import { ApiProperty } from '@nestjs/swagger'

export class DeleteUserResponseDto {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Usuário deletado com sucesso',
  })
  message: string
}
