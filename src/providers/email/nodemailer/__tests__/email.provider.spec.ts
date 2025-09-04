import { Test, TestingModule } from '@nestjs/testing'
import { EmailProvider } from '../email.provider'
import { EnvConfigService } from '@/common/service/env/env-config.service'

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(),
  })),
}))

describe('EmailProvider', () => {
  let service: EmailProvider

  const mockEnvConfigService = {
    get: jest.fn(),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailProvider,
        {
          provide: EnvConfigService,
          useValue: mockEnvConfigService,
        },
      ],
    }).compile()

    service = module.get<EmailProvider>(EmailProvider)

    mockEnvConfigService.get.mockImplementation((key: string) => {
      const config = {
        SMTP_HOST: 'smtp.example.com',
        PORT_EMAIL: 587,
        SECURE_EMAIL: false,
        USER_EMAIL: 'test@example.com',
        PASS_EMAIL: 'password123',
      }
      return config[key]
    })
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should configure transporter with correct options', () => {
    expect(mockEnvConfigService.get).toHaveBeenCalledWith('SMTP_HOST')
    expect(mockEnvConfigService.get).toHaveBeenCalledWith('PORT_EMAIL')
    expect(mockEnvConfigService.get).toHaveBeenCalledWith('SECURE_EMAIL')
    expect(mockEnvConfigService.get).toHaveBeenCalledWith('USER_EMAIL')
    expect(mockEnvConfigService.get).toHaveBeenCalledWith('PASS_EMAIL')
  })

  it('should have sendEmail method', () => {
    expect(typeof service.sendEmail).toBe('function')
  })

  it('should call transporter.sendMail with correct parameters', async () => {
    const emailData = {
      recipient: 'recipient@example.com',
      subject: 'Test Subject',
      body: '<p>Test body</p>',
      attachments: [],
    }

    const mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-id' })
    ;(
      service as unknown as { transporter: { sendMail: jest.Mock } }
    ).transporter = { sendMail: mockSendMail }

    await service.sendEmail(emailData)

    expect(mockSendMail).toHaveBeenCalledWith({
      from: {
        name: 'BTG OTP System',
      },
      to: 'recipient@example.com',
      subject: 'Test Subject',
      html: '<p>Test body</p>',
      attachments: [],
    })
  })

  it('should handle errors gracefully', async () => {
    const emailData = {
      recipient: 'recipient@example.com',
      subject: 'Test Subject',
      body: '<p>Test body</p>',
      attachments: [],
    }

    const mockSendMail = jest.fn().mockRejectedValue(new Error('SMTP error'))
    ;(
      service as unknown as { transporter: { sendMail: jest.Mock } }
    ).transporter = { sendMail: mockSendMail }

    await expect(service.sendEmail(emailData)).resolves.not.toThrow()
  })
})
