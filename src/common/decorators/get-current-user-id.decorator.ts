import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserJwtPayload } from '../interfaces/user-jwt-payload.interface'

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest()
    const user = request.user as UserJwtPayload
    return user.id
  },
)
