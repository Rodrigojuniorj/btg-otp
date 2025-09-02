import 'reflect-metadata'

// Configurações globais para testes
beforeAll(() => {
  // Configurar variáveis de ambiente para testes
  process.env.NODE_ENV = 'test'
  process.env.OTP_LENGTH = '7'
  process.env.OTP_MINUTE_DURATION = '5'
  process.env.OTP_MAX_ATTEMPTS = '3'
})

afterAll(() => {
  // Limpar variáveis de ambiente após os testes
  delete process.env.NODE_ENV
  delete process.env.OTP_LENGTH
  delete process.env.OTP_MINUTE_DURATION
  delete process.env.OTP_MAX_ATTEMPTS
})

// Configurar timeout global para testes
jest.setTimeout(10000)

// Suprimir logs durante os testes (comentado para permitir console.log)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// }
