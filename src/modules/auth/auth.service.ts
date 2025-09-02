import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { RegisterDto } from './dtos/register.dto'
import { AuthUser } from './interfaces/auth-response.interface'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { ValidateOtpDto } from '../user-otp-history/dto/validate-otp.dto'
import { UsersService } from '../users/users.service'
import { UserOtpHistoryService } from '../user-otp-history/user-otp-history.service'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { LoginOtpResponseDto } from '../user-otp-history/dto/login-otp-response.dto'
import { AuthLoginResponseDto } from './dtos/auth-login-response.dto'
import { CacheRepository } from '@/providers/cache/cache-repository'
import { JwtOtpPayload } from '@/common/interfaces/jwt-otp-payload.interface'
import { SendEmailQueueProvider } from '@/providers/email/job/send-email-queue/send-email-queue.provider'
import { EmailTemplatesService } from '@/providers/email/templates'
import { parseTimeToSeconds } from '@/common/utils/parse-time-to-seconds.util'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly userOtpHistoryService: UserOtpHistoryService,
    private readonly envConfigService: EnvConfigService,
    private readonly cache: CacheRepository,
    private readonly sendEmailQueueProvider: SendEmailQueueProvider,
    private readonly emailTemplatesService: EmailTemplatesService,
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

  async login(email: string, password: string): Promise<LoginOtpResponseDto> {
    const user = await this.validateUser(email, password)

    const { hash, expiresAt, otpCode } =
      await this.userOtpHistoryService.create(user.id)

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
        type: 'otp',
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
      subject: 'Token de Acesso - BTG OTP System',
      body: emailHtml,
    })

    return {
      hash,
      accessToken: otpToken,
      validationUrl: `/auth/validate-otp/${hash}`,
    }
  }

  async validate(
    validateOtpDto: ValidateOtpDto,
    user: JwtOtpPayload,
  ): Promise<AuthLoginResponseDto> {
    const isSessionValid = await this.cache.get(
      `otp_session:${user.sub}:${user.hash}`,
    )
    if (!isSessionValid || isSessionValid !== user.sub.toString()) {
      throw new CustomException(ErrorMessages.USER.INVALID_CREDENTIALS())
    }

    const otpHistory = await this.userOtpHistoryService.validateOtp(
      { otpCode: validateOtpDto.otpCode },
      user.hash,
    )

    if (otpHistory.userId !== user.sub) {
      throw new CustomException(ErrorMessages.USER.INVALID_CREDENTIALS())
    }

    await this.cache.delete(`otp_session:${user.hash}`)

    const accessToken = this.jwtService.sign(
      {
        sub: otpHistory.user.id,
        email: otpHistory.user.email,
        type: 'access',
        hash: otpHistory.hash,
      },
      {
        expiresIn: this.envConfigService.get('JWT_EXPIRES_IN'),
        secret: this.envConfigService.get('JWT_SECRET'),
      },
    )

    await this.cache.set(
      `otp_session:${otpHistory.user.id}:${otpHistory.hash}`,
      otpHistory.user.id.toString(),
      parseTimeToSeconds(this.envConfigService.get('JWT_EXPIRES_IN')),
    )

    return {
      accessToken,
    }
  }
}
