import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EnvConfigModule } from '@/common/service/env/env-config.module'
import { SendEmailConsumerProvider } from './job/send-email-consumer/send-email-consumer.provider'
import { SendEmailQueueProvider } from './job/send-email-queue/send-email-queue.provider'
import { EmailProvider } from './nodemailer/email.provider'
import { EmailTemplatesService } from './templates/email-templates.service'
import { RegisterQueue } from '@/common/enums/register-queue.enum'

@Module({
  imports: [
    ConfigModule,
    EnvConfigModule,
    BullModule.registerQueue({ name: RegisterQueue.SEND_EMAIL_QUEUE }),
  ],
  providers: [
    EmailProvider,
    SendEmailQueueProvider,
    SendEmailConsumerProvider,
    EmailTemplatesService,
  ],
  exports: [SendEmailQueueProvider, EmailTemplatesService, EmailProvider],
})
export class EmailProviderModule {}
