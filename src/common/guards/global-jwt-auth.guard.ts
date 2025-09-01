import { Injectable, ExecutionContext, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { JwtService } from '@nestjs/jwt'
import { EnvConfigService } from '../service/env/env-config.service'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { OTP_AUTH_KEY } from '../decorators/otp-auth.decorator'
import { CustomException } from '../exceptions/customException'

@Injectable()
export class GlobalJwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly envConfigService: EnvConfigService,
  ) {
    super()
  }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const isOtpAuth = this.reflector.getAllAndOverride<boolean>(OTP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isOtpAuth) {
      return this.validateOtpToken(context)
    }

    return super.canActivate(context) as boolean
  }

  private validateOtpToken(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new CustomException('Token não fornecido', HttpStatus.UNAUTHORIZED)
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.envConfigService.get('JWT_OTP_SECRET'),
      })

      if (payload.type !== 'otp') {
        throw new CustomException(
          'Token inválido: deve ser um token OTP',
          HttpStatus.UNAUTHORIZED,
        )
      }

      request.user = payload
      return true
    } catch {
      throw new CustomException(
        'Token OTP inválido ou expirado',
        HttpStatus.UNAUTHORIZED,
      )
    }
  }

  private extractTokenFromHeader(request: {
    headers: { authorization?: string }
  }): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
