import { ApiProperty } from '@nestjs/swagger'

export class UserListItemDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  name: string

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@exemplo.com',
  })
  email: string

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-01T12:00:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Data de atualização',
    example: '2024-01-01T12:00:00.000Z',
  })
  updatedAt: Date
}

export class ListUsersResponseDto {
  @ApiProperty({
    description: 'Lista de usuários',
    type: [UserListItemDto],
  })
  users: UserListItemDto[]

  @ApiProperty({
    description: 'Total de usuários',
    example: 10,
  })
  total: number

  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  page: number

  @ApiProperty({
    description: 'Limite por página',
    example: 10,
  })
  limit: number
}
