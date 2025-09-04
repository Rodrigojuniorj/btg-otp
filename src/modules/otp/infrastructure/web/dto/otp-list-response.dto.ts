import { ApiProperty } from '@nestjs/swagger'
import { OtpDto } from './otp.dto'

export class OtpListResponseDto {
  @ApiProperty({
    description: 'Lista de OTPs',
    type: [OtpDto],
    isArray: true,
  })
  data: OtpDto[]

  @ApiProperty({
    description: 'Número total de OTPs',
    example: 25,
    type: Number,
  })
  total: number

  @ApiProperty({
    description: 'Página atual',
    example: 1,
    type: Number,
  })
  page: number

  @ApiProperty({
    description: 'Número de itens por página',
    example: 10,
    type: Number,
  })
  limit: number

  @ApiProperty({
    description: 'Número total de páginas',
    example: 3,
    type: Number,
  })
  totalPages: number
}
