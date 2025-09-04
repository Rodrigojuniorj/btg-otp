import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { GetCurrentUserId } from '@/common/decorators/get-current-user-id.decorator'
import { FindUserByIdUseCase } from '../../application/use-cases/find-user-by-id.use-case'
import { FindUserByIdRequest } from '../../application/interfaces/find-user.interface'
import { UserProfileResponseDto } from './dto/user-profile-response.dto'
import { ProfileSwagger } from './swagger'

@ApiTags('Usuários')
@ApiBearerAuth('Bearer')
@Controller('users')
export class UsersController {
  constructor(private readonly findUserByIdUseCase: FindUserByIdUseCase) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ProfileSwagger.operation
  @ProfileSwagger.response
  async profile(
    @GetCurrentUserId() userId: number,
  ): Promise<UserProfileResponseDto> {
    const request: FindUserByIdRequest = { id: userId }
    return await this.findUserByIdUseCase.execute(request)
  }
}
