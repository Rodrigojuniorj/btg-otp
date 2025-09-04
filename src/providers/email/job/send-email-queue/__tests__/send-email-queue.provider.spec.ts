import { Test, TestingModule } from '@nestjs/testing'
import { SendEmailQueueProvider } from '../send-email-queue.provider'
import { getQueueToken } from '@nestjs/bullmq'

describe('SendEmailQueueProvider', () => {
  let service: SendEmailQueueProvider

  const mockQueue = {
    add: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendEmailQueueProvider,
        {
          provide: getQueueToken('SEND_EMAIL_QUEUE'),
          useValue: mockQueue,
        },
      ],
    }).compile()

    service = module.get<SendEmailQueueProvider>(SendEmailQueueProvider)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should have execute method', () => {
    expect(typeof service.execute).toBe('function')
  })

  it('should add job to queue with correct parameters', async () => {
    const emailData = {
      recipient: 'test@example.com',
      subject: 'Test Subject',
      body: '<p>Test body</p>',
      attachments: [],
    }

    mockQueue.add.mockResolvedValue(undefined)

    await service.execute(emailData)

    expect(mockQueue.add).toHaveBeenCalledWith('SEND_EMAIL_QUEUE', emailData)
  })

  it('should handle queue operations correctly', async () => {
    const emailData = {
      recipient: 'test@example.com',
      subject: 'Test Subject',
      body: '<p>Test body</p>',
      attachments: [],
    }

    mockQueue.add.mockResolvedValue(undefined)

    await expect(service.execute(emailData)).resolves.not.toThrow()
  })
})
