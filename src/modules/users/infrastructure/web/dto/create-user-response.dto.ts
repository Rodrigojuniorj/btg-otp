import { ApiProperty } from '@nestjs/swagger'

export class CreateUserResponseDto {
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
}
