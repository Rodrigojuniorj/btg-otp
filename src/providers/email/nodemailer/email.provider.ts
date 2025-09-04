import { Injectable, Logger } from '@nestjs/common'
import { createTransport, Transporter } from 'nodemailer'
import { SendEmailDto } from './dto/send-email.dto'
import { EnvConfigService } from '@/common/service/env/env-config.service'

@Injectable()
export class EmailProvider {
  private transporter: Transporter
  private readonly logger = new Logger(EmailProvider.name)

  constructor(private readonly envConfigService: EnvConfigService) {
    this.transporter = createTransport({
      host: this.envConfigService.get('SMTP_HOST'),
      port: this.envConfigService.get('PORT_EMAIL'),
      secure: this.envConfigService.get('SECURE_EMAIL'),
      auth: {
        user: this.envConfigService.get('USER_EMAIL'),
        pass: this.envConfigService.get('PASS_EMAIL'),
      },
    })
  }

  async sendEmail(data: SendEmailDto) {
    try {
      await this.transporter.sendMail({
        from: {
          name: 'BTG OTP System',
        },
        to: data.recipient,
        subject: data.subject,
        html: data.body,
        attachments: data.attachments,
      })

      this.logger.log(`Email enviado para ${data.recipient}`)
    } catch (error) {
      this.logger.error(`Erro ao enviar o email: ${error}`)
    }
  }
}
