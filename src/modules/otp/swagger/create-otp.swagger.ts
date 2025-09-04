import {
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger'
import { CreateOtpDto } from '../dto/create-otp.dto'
import { CreateOtpResponseDto } from '../dto/create-otp-response.dto'

export const CreateOtpSwagger = {
  operation: ApiOperation({
    summary: 'Criar novo OTP',
    description: 'Gera um novo código OTP para verificação ou autenticação',
  }),

  body: ApiBody({ type: CreateOtpDto }),

  created: ApiCreatedResponse({
    description: 'OTP criado com sucesso',
    type: CreateOtpResponseDto,
  }),

  badRequest: ApiBadRequestResponse({
    description: 'Dados inválidos fornecidos',
  }),

  conflict: ApiConflictResponse({
    description: 'Já existe um OTP ativo para este identificador',
  }),
}
