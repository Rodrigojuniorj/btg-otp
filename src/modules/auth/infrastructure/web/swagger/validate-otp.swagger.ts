import { ApiResponse, ApiOperation } from '@nestjs/swagger'
import { AuthLoginValidateResponseDto } from '../dto/auth-login-validate-response.dto'

export const ValidateOtpSwagger = {
  operation: ApiOperation({
    summary: 'Validar código OTP',
    description:
      'Valida o código OTP enviado por email. Requer o token JWT temporário gerado no login.',
  }),

  success: ApiResponse({
    status: 200,
    description: 'OTP validado com sucesso, token de acesso gerado',
    type: AuthLoginValidateResponseDto,
  }),

  unauthorized: ApiResponse({
    status: 401,
    description: 'Token JWT inválido ou expirado',
  }),
}
