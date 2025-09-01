import { Controller, HttpCode, HttpStatus, Get } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'

import { GetCurrentUserId } from '@/common/decorators/get-current-user-id.decorator'
import { UsersService } from './users.service'
import { UserResponseDto } from './dto/user-response.dto'

@ApiTags('Usuários')
@ApiBearerAuth('Bearer')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Obter perfil do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário obtido com sucesso',
    type: UserResponseDto,
  })
  async profile(@GetCurrentUserId() userId: number): Promise<UserResponseDto> {
    return await this.usersService.profile(userId)
  }
}
