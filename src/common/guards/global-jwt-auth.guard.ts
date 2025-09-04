import { Injectable, ExecutionContext, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { JwtService } from '@nestjs/jwt'
import { EnvConfigService } from '../service/env/env-config.service'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { OTP_AUTH_KEY } from '../decorators/otp-auth.decorator'
import { CacheRepository } from '@/providers/cache/cache-repository'
import { CustomException } from '../exceptions/customException'
import { JwtTypeSign } from '../enums/jwt-type-sign.enum'
import { ErrorMessages } from '../constants/errorMessages'

@Injectable()
export class GlobalJwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly envConfigService: EnvConfigService,
    private readonly cache: CacheRepository,
  ) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    return this.validateAccessToken(context)
  }

  private validateOtpToken(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new CustomException(
        ErrorMessages.GENERAL.TOKEN_NOT_PROVIDED(),
        HttpStatus.UNAUTHORIZED,
      )
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.envConfigService.get('JWT_OTP_SECRET'),
      })

      if (payload.type !== JwtTypeSign.OTP) {
        throw new CustomException(
          ErrorMessages.GENERAL.TOKEN_TYPE_INVALID(),
          HttpStatus.UNAUTHORIZED,
        )
      }

      request.user = payload
      return true
    } catch {
      throw new CustomException(
        ErrorMessages.GENERAL.TOKEN_OTP_INVALID(),
        HttpStatus.UNAUTHORIZED,
      )
    }
  }

  private async validateAccessToken(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new CustomException(
        ErrorMessages.GENERAL.TOKEN_NOT_PROVIDED(),
        HttpStatus.UNAUTHORIZED,
      )
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.envConfigService.get('JWT_SECRET'),
      })

      const activeSession = await this.cache.get(
        `otp_session:${payload.sub}:${payload.hash}`,
      )

      if (!activeSession || activeSession !== payload.sub.toString()) {
        throw new CustomException(
          ErrorMessages.GENERAL.TOKEN_ACCESS_INVALID(),
          HttpStatus.UNAUTHORIZED,
        )
      }

      request.user = payload
      return true
    } catch (error) {
      if (error instanceof CustomException) {
        throw error
      }
      throw new CustomException(
        ErrorMessages.GENERAL.TOKEN_ACCESS_INVALID(),
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
