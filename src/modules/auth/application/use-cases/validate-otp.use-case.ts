import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ValidateOtpUseCase } from '../../../otp/application/use-cases/validate-otp.use-case'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { CacheRepository } from '@/providers/cache/cache-repository'
import { JwtTypeSign } from '@/common/enums/jwt-type-sign.enum'
import { parseTimeToSeconds } from '@/common/utils/parse-time-to-seconds.util'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import {
  ValidateOtpRequest,
  ValidateOtpResponse,
} from '../interfaces/validate-otp.interface'

@Injectable()
export class AuthValidateOtpUseCase {
  private readonly logger = new Logger(AuthValidateOtpUseCase.name)

  constructor(
    private readonly validateOtpUseCase: ValidateOtpUseCase,
    private readonly jwtService: JwtService,
    private readonly envConfigService: EnvConfigService,
    private readonly cache: CacheRepository,
  ) {}

  async execute(request: ValidateOtpRequest): Promise<ValidateOtpResponse> {
    const { otpCode, user } = request

    const isSessionValid = await this.cache.get(
      `otp_session:${user.sub}:${user.hash}`,
    )
    if (!isSessionValid || isSessionValid !== user.sub.toString()) {
      throw new CustomException(ErrorMessages.USER.INVALID_CREDENTIALS())
    }

    await this.validateOtpUseCase.execute({
      otpCode,
      hash: user.hash,
    })

    await this.cache.delete(`otp_session:${user.hash}`)

    const accessToken = this.jwtService.sign(
      {
        sub: user.sub,
        email: user.email,
        type: JwtTypeSign.ACCESS,
        hash: user.hash,
      },
      {
        expiresIn: this.envConfigService.get('JWT_EXPIRES_IN'),
        secret: this.envConfigService.get('JWT_SECRET'),
      },
    )

    await this.cache.set(
      `otp_session:${user.sub}:${user.hash}`,
      user.sub.toString(),
      parseTimeToSeconds(this.envConfigService.get('JWT_EXPIRES_IN')),
    )

    this.logger.log(`Login completado com sucesso - otp_session:${user.sub}`)

    return {
      accessToken,
    }
  }
}
