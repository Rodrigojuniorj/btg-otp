import { Injectable } from '@nestjs/common'
import {
  generateOtpEmail,
  generateWelcomeEmail,
  generatePasswordResetEmail,
  EmailTemplateData,
} from './index'

@Injectable()
export class EmailTemplatesService {
  generateOtpEmail(data: EmailTemplateData): string {
    return generateOtpEmail(data)
  }

  generateWelcomeEmail(data: EmailTemplateData): string {
    return generateWelcomeEmail(data)
  }

  generatePasswordResetEmail(data: EmailTemplateData): string {
    return generatePasswordResetEmail(data)
  }
}
