import 'reflect-metadata'

beforeAll(() => {
  process.env.NODE_ENV = 'test'
  process.env.OTP_LENGTH = '7'
  process.env.OTP_MINUTE_DURATION = '5'
  process.env.OTP_MAX_ATTEMPTS = '3'
})

afterAll(() => {
  delete process.env.NODE_ENV
  delete process.env.OTP_LENGTH
  delete process.env.OTP_MINUTE_DURATION
  delete process.env.OTP_MAX_ATTEMPTS
})

jest.setTimeout(10000)

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}
