import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { OtpService } from './otp.service'
import { CreateOtpDto } from './dto/create-otp.dto'
import { ValidateOtpDto } from './dto/validate-otp.dto'
import { Public } from '@/common/decorators/public.decorator'
import {
  CreateOtpSwagger,
  ValidateOtpSwagger,
  OtpStatusSwagger,
} from './swagger'

@ApiTags('OTP')
@Controller('otp')
@Public()
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @CreateOtpSwagger.operation
  @CreateOtpSwagger.body
  @CreateOtpSwagger.created
  @CreateOtpSwagger.badRequest
  @CreateOtpSwagger.conflict
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createOtp(@Body() createOtpDto: CreateOtpDto) {
    return this.otpService.create(createOtpDto)
  }

  @ValidateOtpSwagger.operation
  @ValidateOtpSwagger.body
  @ValidateOtpSwagger.ok
  @ValidateOtpSwagger.unauthorized
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateOtp(@Body() validateOtpDto: ValidateOtpDto) {
    await this.otpService.validateOtp(validateOtpDto)

    return {
      message: 'OTP validado com sucesso',
    }
  }

  @OtpStatusSwagger.operation
  @OtpStatusSwagger.param
  @OtpStatusSwagger.ok
  @OtpStatusSwagger.notFound
  @Get('status/:hash')
  async getOtpStatus(@Param('hash') hash: string) {
    const status = await this.otpService.getOtpStatus(hash)

    if (!status) {
      return { message: 'OTP não encontrado' }
    }

    return status
  }
}
