import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from '@/common/decorators/public.decorator'
import { CreateOtpUseCase } from '../../application/use-cases/create-otp.use-case'
import { ValidateOtpUseCase } from '../../application/use-cases/validate-otp.use-case'
import { GetOtpStatusUseCase } from '../../application/use-cases/get-otp-status.use-case'
import { CreateOtpRequest } from '../../application/interfaces/create-otp.interface'
import { CreateOtpDto } from './dto/create-otp.dto'
import { CreateOtpSwagger } from './swagger'
import { CreateOtpResponseDto } from './dto/create-otp-response.dto'

@ApiTags('OTP')
@Controller('otp')
@Public()
export class OtpController {
  constructor(
    private readonly createOtpUseCase: CreateOtpUseCase,
    private readonly validateOtpUseCase: ValidateOtpUseCase,
    private readonly getOtpStatusUseCase: GetOtpStatusUseCase,
  ) {}

  @CreateOtpSwagger.operation
  @CreateOtpSwagger.body
  @CreateOtpSwagger.created
  @CreateOtpSwagger.badRequest
  @CreateOtpSwagger.conflict
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createOtp(
    @Body() createOtpDto: CreateOtpDto,
  ): Promise<CreateOtpResponseDto> {
    const request: CreateOtpRequest = {
      email: createOtpDto.email,
      purpose: createOtpDto.purpose,
    }

    return this.createOtpUseCase.execute(request)
  }
}
