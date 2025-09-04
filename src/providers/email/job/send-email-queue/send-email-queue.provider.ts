import { InjectQueue } from '@nestjs/bullmq'
import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bullmq'
import { SendEmailDto } from '../../nodemailer/dto/send-email.dto'
import { RegisterQueue } from '@/common/enums/register-queue.enum'

@Injectable()
export class SendEmailQueueProvider {
  private readonly logger = new Logger(SendEmailQueueProvider.name)

  constructor(
    @InjectQueue(RegisterQueue.SEND_EMAIL_QUEUE) private sendEmailQueue: Queue,
  ) {}

  async execute(data: SendEmailDto) {
    this.logger.log(`Adicionando email para ${data.recipient} na fila`)
    await this.sendEmailQueue.add(RegisterQueue.SEND_EMAIL_QUEUE, data)
  }
}
