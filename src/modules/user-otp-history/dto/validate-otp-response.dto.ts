import { ApiProperty } from '@nestjs/swagger'

export class ValidateOtpResponseDto {
  @ApiProperty({
    description: 'JWT de acesso ao sistema',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string

  @ApiProperty({
    description: 'Tipo do token',
    example: 'Bearer',
  })
  tokenType: string

  @ApiProperty({
    description: 'Tempo de expiração em segundos',
    example: 3600,
  })
  expiresIn: number

  @ApiProperty({
    description: 'Dados do usuário',
  })
  user: {
    id: number
    email: string
    name: string
  }
}
