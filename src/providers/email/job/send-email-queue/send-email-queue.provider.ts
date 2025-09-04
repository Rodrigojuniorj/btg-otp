import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { SendEmailDto } from '../../nodemailer/dto/send-email.dto'
import { RegisterQueue } from '@/common/enums/register-queue.enum'

@Injectable()
export class SendEmailQueueProvider {
  constructor(
    @InjectQueue(RegisterQueue.SEND_EMAIL_QUEUE) private sendEmailQueue: Queue,
  ) {}

  async execute(data: SendEmailDto) {
    await this.sendEmailQueue.add(RegisterQueue.SEND_EMAIL_QUEUE, data)
  }
}
