import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common'
import { Response } from 'express'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { Public } from '../../common/decorators/public.decorator'
import { OtpAuth } from '../../common/decorators/otp-auth.decorator'
import { LoginOtpChallengeResponseDto } from './dtos/login-otp-challenge-response.dto'
import { TaskType } from '@/common/enums/task-type.enum'
import { GetCurrentUserOtp } from '@/common/decorators/get-current-user-otp.decorator'
import { JwtOtpPayload } from '@/common/interfaces/jwt-otp-payload.interface'
import { AuthLoginValidateResponseDto } from './dtos/auth-login-validate-response.dto'
import { AuthValidateOtpDto } from './dtos/auth-validate-otp.dto'
import { LoginSwagger, RegisterSwagger, ValidateOtpSwagger } from './swagger'

@ApiTags('Autenticação')
@ApiBearerAuth('Bearer')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  @LoginSwagger.operation
  @LoginSwagger.response
  @LoginSwagger.badRequest
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginOtpChallengeResponseDto> {
    const loginOtpResponseDto = await this.authService.login(
      loginDto.email,
      loginDto.password,
    )

    res.setHeader('x-task-type', TaskType.OTP_CHALLENGER)

    return {
      message: 'Código OTP enviado para seu email',
      taskType: TaskType.OTP_CHALLENGER,
      accessToken: loginOtpResponseDto.accessToken,
      validationUrl: loginOtpResponseDto.validationUrl,
    }
  }

  @RegisterSwagger.operation
  @RegisterSwagger.response
  @RegisterSwagger.badRequest
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<void> {
    await this.authService.register(registerDto)
  }

  @Post('validate-otp')
  @OtpAuth()
  @HttpCode(HttpStatus.OK)
  @ValidateOtpSwagger.operation
  @ValidateOtpSwagger.success
  @ValidateOtpSwagger.unauthorized
  async validateOtp(
    @Body() authValidateOtpDto: AuthValidateOtpDto,
    @GetCurrentUserOtp() userOtp: JwtOtpPayload,
  ): Promise<AuthLoginValidateResponseDto> {
    return this.authService.validate(authValidateOtpDto, userOtp)
  }
}
