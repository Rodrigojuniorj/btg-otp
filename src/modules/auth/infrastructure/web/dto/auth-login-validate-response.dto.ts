import { ApiProperty } from '@nestjs/swagger'

export class AuthLoginValidateResponseDto {
  @ApiProperty({
    description: 'Token de acesso final',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string
}
