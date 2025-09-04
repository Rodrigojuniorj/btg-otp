import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger'
import {
  OtpStatusResponseDto,
  OtpNotFoundResponseDto,
} from '../dto/otp-status-response.dto'

export const OtpStatusSwagger = {
  operation: ApiOperation({
    summary: 'Verificar status do OTP',
    description: 'Retorna o status atual e data de expiração de um OTP',
  }),

  param: ApiParam({
    name: 'hash',
    description: 'Hash único do OTP',
    example: 'abc123def456ghi789',
  }),

  ok: ApiOkResponse({
    description: 'Status do OTP encontrado',
    type: OtpStatusResponseDto,
  }),

  notFound: ApiNotFoundResponse({
    description: 'OTP não encontrado',
    type: OtpNotFoundResponseDto,
  }),
}
