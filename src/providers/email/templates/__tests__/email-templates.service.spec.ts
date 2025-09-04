import { Test, TestingModule } from '@nestjs/testing'
import { EmailTemplatesService } from '../email-templates.service'
import { EmailTemplateData } from '../base-template'

describe('EmailTemplatesService', () => {
  let service: EmailTemplatesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailTemplatesService],
    }).compile()

    service = module.get<EmailTemplatesService>(EmailTemplatesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should extend Injectable', () => {
    expect(service).toBeInstanceOf(EmailTemplatesService)
  })

  describe('generateOtpEmail', () => {
    it('should generate OTP email with minimal data', () => {
      const data: EmailTemplateData = {
        otpCode: '123456',
      }

      const result = service.generateOtpEmail(data)

      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result).toContain('123456')
      expect(result).toContain('BTG OTP System')
      expect(result).toContain('Usuário')
      expect(result).toContain('10')
    })

    it('should generate OTP email with all data provided', () => {
      const data: EmailTemplateData = {
        userName: 'João Silva',
        otpCode: '654321',
        companyName: 'Minha Empresa',
        otpExpirationMinutes: 15,
      }

      const result = service.generateOtpEmail(data)

      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result).toContain('João Silva')
      expect(result).toContain('654321')
      expect(result).toContain('Minha Empresa')
      expect(result).toContain('15')
    })

    it('should generate OTP email with custom colors (not implemented)', () => {
      const data: EmailTemplateData = {
        otpCode: '111111',
        primaryColor: '#ff0000',
        secondaryColor: '#00ff00',
      }

      const result = service.generateOtpEmail(data)

      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result).toContain('111111')

      expect(result).toContain('#2563eb')
      expect(result).toContain('#64748b')
    })

    it('should generate OTP email with validation URL (not implemented)', () => {
      const data: EmailTemplateData = {
        otpCode: '999999',
        validationUrl: 'https://example.com/validate',
      }

      const result = service.generateOtpEmail(data)

      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result).toContain('999999')
    })

    it('should generate OTP email with logo URL (not implemented)', () => {
      const data: EmailTemplateData = {
        otpCode: '888888',
        logoUrl: 'https://example.com/logo.png',
      }

      const result = service.generateOtpEmail(data)

      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result).toContain('888888')
    })

    it('should generate OTP email with default values when data is empty', () => {
      const data: EmailTemplateData = {}

      const result = service.generateOtpEmail(data)

      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result).toContain('BTG OTP System')
      expect(result).toContain('Usuário')
      expect(result).toContain('10')
    })

    it('should generate OTP email with zero expiration minutes', () => {
      const data: EmailTemplateData = {
        otpCode: '000000',
        otpExpirationMinutes: 0,
      }

      const result = service.generateOtpEmail(data)

      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result).toContain('000000')
      expect(result).toContain('0')
    })

    it('should generate OTP email with very long expiration minutes', () => {
      const data: EmailTemplateData = {
        otpCode: '555555',
        otpExpirationMinutes: 1440,
      }

      const result = service.generateOtpEmail(data)

      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result).toContain('555555')
      expect(result).toContain('1440')
    })

    it('should generate valid HTML structure', () => {
      const data: EmailTemplateData = {
        otpCode: '777777',
      }

      const result = service.generateOtpEmail(data)

      expect(result).toContain('<!DOCTYPE html>')
      expect(result).toContain('<html lang="pt-BR">')
      expect(result).toContain('<head>')
      expect(result).toContain('<meta charset="UTF-8">')
      expect(result).toContain('<meta name="viewport"')
      expect(result).toContain('<title>')
      expect(result).toContain('<style>')
      expect(result).toContain('</style>')
      expect(result).toContain('<body>')
      expect(result).toContain('</body>')
      expect(result).toContain('</html>')
    })

    it('should generate email with proper CSS classes', () => {
      const data: EmailTemplateData = {
        otpCode: '666666',
      }

      const result = service.generateOtpEmail(data)

      expect(result).toContain('class="container"')
      expect(result).toContain('class="header"')
      expect(result).toContain('class="content"')
      expect(result).toContain('class="greeting"')
      expect(result).toContain('class="otp-container"')
    })

    it('should generate email with responsive design', () => {
      const data: EmailTemplateData = {
        otpCode: '444444',
      }

      const result = service.generateOtpEmail(data)

      expect(result).toContain('max-width: 600px')
      expect(result).toContain('width=device-width')
      expect(result).toContain('initial-scale=1.0')
    })
  })
})
