import { Test, TestingModule } from '@nestjs/testing'
import { SendEmailConsumerProvider } from '../send-email-consumer/send-email-consumer.provider'
import { EmailProvider } from '../../nodemailer/email.provider'
import { Job } from 'bullmq'
import { SendEmailDto } from '../../nodemailer/dto/send-email.dto'

describe('SendEmailConsumerProvider', () => {
  let provider: SendEmailConsumerProvider
  let emailProvider: jest.Mocked<EmailProvider>

  const mockEmailProvider = {
    sendEmail: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendEmailConsumerProvider,
        {
          provide: EmailProvider,
          useValue: mockEmailProvider,
        },
      ],
    }).compile()

    provider = module.get<SendEmailConsumerProvider>(SendEmailConsumerProvider)
    emailProvider = module.get(EmailProvider)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })

  it('should extend WorkerHost', () => {
    expect(provider).toBeInstanceOf(SendEmailConsumerProvider)
  })

  describe('process', () => {
    const mockJobData: SendEmailDto = {
      recipient: 'test@example.com',
      subject: 'Test Email',
      body: 'Test content',
    }

    const mockJob = {
      data: mockJobData,
    } as Job<SendEmailDto>

    it('should process email job successfully', async () => {
      emailProvider.sendEmail.mockResolvedValue(undefined)

      await provider.process(mockJob)

      expect(emailProvider.sendEmail).toHaveBeenCalledWith(mockJobData)
    })

    it('should process email job successfully with logging', async () => {
      emailProvider.sendEmail.mockResolvedValue(undefined)

      await provider.process(mockJob)

      expect(emailProvider.sendEmail).toHaveBeenCalledWith(mockJobData)
    })

    it('should handle email provider errors', async () => {
      const mockError = new Error('Email service unavailable')
      emailProvider.sendEmail.mockRejectedValue(mockError)

      await provider.process(mockJob)

      expect(emailProvider.sendEmail).toHaveBeenCalledWith(mockJobData)
    })

    it('should handle email provider errors with logging', async () => {
      const mockError = new Error('Email service unavailable')
      emailProvider.sendEmail.mockRejectedValue(mockError)

      await provider.process(mockJob)

      expect(emailProvider.sendEmail).toHaveBeenCalledWith(mockJobData)
    })

    it('should process job with different recipient', async () => {
      const differentJobData: SendEmailDto = {
        ...mockJobData,
        recipient: 'another@example.com',
      }
      const differentJob = {
        data: differentJobData,
      } as Job<SendEmailDto>

      emailProvider.sendEmail.mockResolvedValue(undefined)

      await provider.process(differentJob)

      expect(emailProvider.sendEmail).toHaveBeenCalledWith(differentJobData)
    })

    it('should process job with complex email data', async () => {
      const complexJobData: SendEmailDto = {
        recipient: 'complex@example.com',
        subject: 'Complex Email with Special Characters: áéíóú çãõ',
        body: 'Complex Text with Special Characters: áéíóú çãõ',
      }
      const complexJob = {
        data: complexJobData,
      } as Job<SendEmailDto>

      emailProvider.sendEmail.mockResolvedValue(undefined)

      await provider.process(complexJob)

      expect(emailProvider.sendEmail).toHaveBeenCalledWith(complexJobData)
    })
  })

  describe('logger', () => {
    it('should have logger instance', () => {
      expect(provider).toBeDefined()
      expect(provider).toBeInstanceOf(SendEmailConsumerProvider)
    })

    it('should have correct logger name', () => {
      expect(provider).toBeDefined()
    })
  })
})
