import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { RegisterDto } from './dtos/register.dto'
import { AuthUser } from './interfaces/auth-response.interface'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { UsersService } from '../users/users.service'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { AuthLoginResponseDto } from './dtos/auth-login-response.dto'
import { CacheRepository } from '@/providers/cache/cache-repository'
import { JwtOtpPayload } from '@/common/interfaces/jwt-otp-payload.interface'
import { SendEmailQueueProvider } from '@/providers/email/job/send-email-queue/send-email-queue.provider'
import { EmailTemplatesService } from '@/providers/email/templates/email-templates.service'
import { parseTimeToSeconds } from '@/common/utils/parse-time-to-seconds.util'
import { OtpService } from '../otp/otp.service'
import { OtpPurpose } from '../otp/enums/otp.enum'
import { AuthLoginValidateResponseDto } from './dtos/auth-login-validate-response.dto'
import { AuthValidateOtpDto } from './dtos/auth-validate-otp.dto'
import { JwtTypeSign } from '@/common/enums/jwt-type-sign.enum'
import { SubjectEmail } from '@/providers/email/enums/subject-email.enum'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly envConfigService: EnvConfigService,
    private readonly cache: CacheRepository,
    private readonly sendEmailQueueProvider: SendEmailQueueProvider,
    private readonly emailTemplatesService: EmailTemplatesService,
    private readonly otpService: OtpService,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthUser> {
    const user = await this.usersService.findByEmailAndPassword(email)

    if (!user) {
      throw new CustomException(ErrorMessages.USER.INVALID_CREDENTIALS())
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    }

    throw new CustomException(ErrorMessages.USER.INVALID_CREDENTIALS())
  }

  async register(registerDto: RegisterDto): Promise<void> {
    const existingUser = await this.usersService.findByEmail(registerDto.email)

    if (existingUser) {
      throw new CustomException(ErrorMessages.USER.EMAIL_EXISTS())
    }

    await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password,
    })
  }

  async login(email: string, password: string): Promise<AuthLoginResponseDto> {
    const user = await this.validateUser(email, password)

    const { hash, expiresAt, otpCode } = await this.otpService.create({
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
      accessToken: otpToken,
      validationUrl: `/auth/validate-otp/${hash}`,
    }
  }

  async validate(
    authValidateOtpDto: AuthValidateOtpDto,
    user: JwtOtpPayload,
  ): Promise<AuthLoginValidateResponseDto> {
    const isSessionValid = await this.cache.get(
      `otp_session:${user.sub}:${user.hash}`,
    )
    if (!isSessionValid || isSessionValid !== user.sub.toString()) {
      throw new CustomException(ErrorMessages.USER.INVALID_CREDENTIALS())
    }

    await this.otpService.validateOtp({
      otpCode: authValidateOtpDto.otpCode,
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

    return {
      accessToken,
    }
  }
}
