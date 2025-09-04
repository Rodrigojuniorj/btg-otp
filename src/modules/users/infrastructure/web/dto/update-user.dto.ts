import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@exemplo.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
    minLength: 6,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string
}
