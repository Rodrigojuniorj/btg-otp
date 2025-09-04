import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { FindUserByEmailAndPasswordUseCase } from '../../../users/application/use-cases/find-user-by-email-and-password.use-case'
import { CreateOtpUseCase } from '../../../otp/application/use-cases/create-otp.use-case'
import { OtpPurpose } from '../../../otp/domain/enums/otp.enum'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { CacheRepository } from '@/providers/cache/cache-repository'
import { SendEmailQueueProvider } from '@/providers/email/job/send-email-queue/send-email-queue.provider'
import { EmailTemplatesService } from '@/providers/email/templates/email-templates.service'
import { SubjectEmail } from '@/providers/email/enums/subject-email.enum'
import { JwtTypeSign } from '@/common/enums/jwt-type-sign.enum'
import { AuthTaskType } from '../../domain/enums/auth.enum'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { LoginRequest, LoginResponse } from '../interfaces/login.interface'

@Injectable()
export class LoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name)

  constructor(
    private readonly findUserByEmailAndPasswordUseCase: FindUserByEmailAndPasswordUseCase,
    private readonly createOtpUseCase: CreateOtpUseCase,
    private readonly jwtService: JwtService,
    private readonly envConfigService: EnvConfigService,
    private readonly cache: CacheRepository,
    private readonly sendEmailQueueProvider: SendEmailQueueProvider,
    private readonly emailTemplatesService: EmailTemplatesService,
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    const { email, password } = request

    const user = await this.findUserByEmailAndPasswordUseCase.execute({
      email,
      password,
    })

    if (!user) {
      throw new CustomException(ErrorMessages.USER.INVALID_CREDENTIALS())
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new CustomException(ErrorMessages.USER.INVALID_CREDENTIALS())
    }

    const { hash, expiresAt, otpCode } = await this.createOtpUseCase.execute({
      email: user.email,
      purpose: OtpPurpose.LOGIN,
    })

    await this.cache.invalidateCache(`otp_session:${user.id}:*`)

    const ttlSeconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000)

    await this.cache.set(
      `otp_session:${user.id}:${hash}`,
      user.id.toString(),
      ttlSeconds,
    )

    this.logger.log(`OTP criado para login - otp_session:${user.id}`)

    const otpToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        hash,
        type: JwtTypeSign.OTP,
      },
      {
        expiresIn: expiresAt.getTime(),
        secret: this.envConfigService.get('JWT_OTP_SECRET'),
      },
    )

    const emailHtml = this.emailTemplatesService.generateOtpEmail({
      userName: user.name,
      otpCode,
      companyName: 'BTG OTP System',
      otpExpirationMinutes: this.envConfigService.get('OTP_MINUTE_DURATION'),
    })

    await this.sendEmailQueueProvider.execute({
      recipient: user.email,
      subject: SubjectEmail.TOKEN_ACCESS,
      body: emailHtml,
    })

    return {
      message: 'Código OTP enviado para seu email',
      taskType: AuthTaskType.OTP_CHALLENGER,
      accessToken: otpToken,
      validationUrl: `/auth/validate-otp/${hash}`,
    }
  }
}
