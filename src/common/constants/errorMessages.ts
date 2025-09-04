export const ErrorMessages = {
  USER: {
    NOT_FOUND: (id: number) => `Usuário com ID ${id} não encontrado`,
    EMAIL_EXISTS: () => `Email já está em uso`,
    ALREADY_EXISTS: (email: string) => `Usuário com email ${email} já existe`,
    INVALID_CREDENTIALS: () => 'Credenciais inválidas',
    UNAUTHORIZED: () => 'Usuário não autorizado',
    FORBIDDEN: () => 'Acesso negado',
  },
  USER_OTP_HISTORY: {
    INVALID_OTP: () => 'OTP inválido',
    OTP_EXPIRED: () => 'OTP expirado',
    OTP_USED: () => 'OTP já foi utilizado',
    INVALID_OTP_CODE: () => 'Código OTP inválido',
    MAX_ATTEMPTS_EXCEEDED: () =>
      'Número máximo de tentativas excedido. OTP bloqueado.',
    OTP_ALREADY_ACTIVE: () =>
      'Já existe um OTP ativo, expirado ou bloqueado. Aguarde o tempo de expiração.',
  },
  OTP: {
    OTP_CREATE: () => 'É necessário fornecer um email',
    INVALID_OTP: () => 'OTP inválido',
    OTP_EXPIRED: () => 'OTP expirado',
    OTP_USED: () => 'OTP já foi utilizado',
    INVALID_OTP_CODE: () => 'Código OTP inválido',
    MAX_ATTEMPTS_EXCEEDED: () =>
      'Número máximo de tentativas excedido. OTP bloqueado.',
    OTP_ALREADY_ACTIVE: () =>
      'Já existe um OTP ativo, expirado ou bloqueado. Aguarde o tempo de expiração.',
  },
  GENERAL: {
    VALIDATION_ERROR: (field: string) => `Erro de validação no campo: ${field}`,
    INTERNAL_ERROR: () => 'Erro interno do servidor',
    BAD_REQUEST: () => 'Requisição inválida',
    NOT_FOUND: (resource: string) => `${resource} não encontrado`,
    TOKEN_INVALID: () => 'Token inválido',
    TOKEN_EXPIRED: () => 'Token expirado',
    TOKEN_NOT_PROVIDED: () => 'Token não fornecido',
    TOKEN_TYPE_INVALID: () => 'Tipo de token inválido',
    TOKEN_OTP_INVALID: () => 'Token OTP inválido ou expirado',
    TOKEN_ACCESS_INVALID: () => 'Token de acesso inválido ou expirado',
  },
}
