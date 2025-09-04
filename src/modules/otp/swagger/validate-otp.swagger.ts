import {
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ValidateOtpDto } from '../infrastructure/web/dto/validate-otp.dto'
import { ValidateOtpResponseDto } from '../infrastructure/web/dto/validate-otp-response.dto'

export const ValidateOtpSwagger = {
  operation: ApiOperation({
    summary: 'Validar OTP',
    description: 'Valida um código OTP usando o hash e código fornecidos',
  }),

  body: ApiBody({ type: ValidateOtpDto }),

  ok: ApiOkResponse({
    description: 'OTP validado com sucesso',
    type: ValidateOtpResponseDto,
  }),

  unauthorized: ApiUnauthorizedResponse({
    description: 'OTP inválido, expirado ou já utilizado',
  }),
}
