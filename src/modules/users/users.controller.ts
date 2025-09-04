import { Controller, HttpCode, HttpStatus, Get } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { GetCurrentUserId } from '@/common/decorators/get-current-user-id.decorator'
import { UsersService } from './users.service'
import { UserResponseDto } from './dto/user-response.dto'
import { ProfileSwagger } from './swagger'

@ApiTags('Usuários')
@ApiBearerAuth('Bearer')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ProfileSwagger.operation
  @ProfileSwagger.response
  async profile(@GetCurrentUserId() userId: number): Promise<UserResponseDto> {
    return await this.usersService.profile(userId)
  }
}
