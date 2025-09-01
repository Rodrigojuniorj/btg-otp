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
import { JwtOtpPayload } from '@/common/interfaces/jwt-otp-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly userOtpHistoryService: UserOtpHistoryService,
    private readonly envConfigService: EnvConfigService,
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

    await this.userOtpHistoryService.expireOldOtps(user.id)

    const { hash, expiresAt } = await this.userOtpHistoryService.create(user.id)

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

    return {
      accessToken: otpToken,
      validationUrl: `/auth/validate-otp/${hash}`,
    }
  }

  async validate(
    validateOtpDto: ValidateOtpDto,
    userOtp: JwtOtpPayload,
  ): Promise<AuthLoginResponseDto> {
    const otpHistory = await this.userOtpHistoryService.validateOtp(
      {
        otpCode: validateOtpDto.otpCode,
      },
      userOtp.hash,
    )

    if (otpHistory.userId !== userOtp.sub) {
      throw new CustomException(ErrorMessages.USER.INVALID_CREDENTIALS())
    }

    const accessToken = this.jwtService.sign(
      {
        sub: otpHistory.user.id,
        email: otpHistory.user.email,
        type: 'access',
      },
      {
        expiresIn: this.envConfigService.get('JWT_EXPIRES_IN'),
        secret: this.envConfigService.get('JWT_SECRET'),
      },
    )

    return {
      accessToken,
    }
  }
}
