import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtOtpPayload } from '../interfaces/jwt-otp-payload.interface'

export const GetCurrentUserOtp = createParamDecorator(
  (_: undefined, context: ExecutionContext): JwtOtpPayload => {
    const request = context.switchToHttp().getRequest()
    const user = request.user as JwtOtpPayload
    return user
  },
)
