import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { SendEmailDto } from '../../nodemailer/dto/send-email.dto'
import { EmailProvider } from '../../nodemailer/email.provider'
import { Logger } from '@nestjs/common'

@Processor('SEND_EMAIL_QUEUE')
export class SendEmailConsumerProvider extends WorkerHost {
  private readonly logger = new Logger(SendEmailConsumerProvider.name)

  constructor(private readonly emailProvider: EmailProvider) {
    super()
  }

  async process(job: Job<SendEmailDto>): Promise<void> {
    try {
      this.logger.log(`Sending email to ${job.data.recipient}`)
      await this.emailProvider.sendEmail(job.data)
    } catch (error) {
      this.logger.error(`Error sending email to ${job.data.recipient}`, error)
      throw error
    }
  }
}
