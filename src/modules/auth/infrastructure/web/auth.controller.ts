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
import { LoginUseCase } from '../../application/use-cases/login.use-case'
import { RegisterUseCase } from '../../application/use-cases/register.use-case'
import { AuthValidateOtpUseCase } from '../../application/use-cases/validate-otp.use-case'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { LoginOtpChallengeResponseDto } from './dto/login-otp-challenge-response.dto'
import { TaskType } from '@/common/enums/task-type.enum'
import { GetCurrentUserOtp } from '@/common/decorators/get-current-user-otp.decorator'
import { JwtOtpPayload } from '@/common/interfaces/jwt-otp-payload.interface'
import { AuthLoginValidateResponseDto } from './dto/auth-login-validate-response.dto'
import { AuthValidateOtpDto } from './dto/auth-validate-otp.dto'
import { LoginResponse } from '../../application/interfaces/login.interface'
import { RegisterResponse } from '../../application/interfaces/register.interface'
import { ValidateOtpResponse } from '../../application/interfaces/validate-otp.interface'
import { LoginSwagger, RegisterSwagger, ValidateOtpSwagger } from './swagger'
import { Public } from '@/common/decorators/public.decorator'
import { OtpAuth } from '@/common/decorators/otp-auth.decorator'

@ApiTags('Autenticação')
@ApiBearerAuth('Bearer')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly authValidateOtpUseCase: AuthValidateOtpUseCase,
  ) {}

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
    const loginResponse: LoginResponse = await this.loginUseCase.execute({
      email: loginDto.email,
      password: loginDto.password,
    })

    res.setHeader('x-task-type', TaskType.OTP_CHALLENGER)

    return {
      message: loginResponse.message,
      taskType: loginResponse.taskType,
      accessToken: loginResponse.accessToken,
      validationUrl: loginResponse.validationUrl,
    }
  }

  @RegisterSwagger.operation
  @RegisterSwagger.response
  @RegisterSwagger.badRequest
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponse> {
    return await this.registerUseCase.execute({
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password,
    })
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
    const validateOtpResponse: ValidateOtpResponse =
      await this.authValidateOtpUseCase.execute({
        otpCode: authValidateOtpDto.otpCode,
        user: userOtp,
      })

    return {
      accessToken: validateOtpResponse.accessToken,
    }
  }
}
