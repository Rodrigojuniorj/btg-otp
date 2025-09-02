import 'reflect-metadata'

// Configurações específicas para testes e2e
process.env.NODE_ENV = 'test'
process.env.OTP_LENGTH = '7'
process.env.OTP_MINUTE_DURATION = '5'
process.env.OTP_MAX_ATTEMPTS = '3'

// Configurar timeout para testes e2e (mais longo que testes unitários)
jest.setTimeout(30000)
