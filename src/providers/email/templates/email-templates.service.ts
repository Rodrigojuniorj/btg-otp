import { Injectable } from '@nestjs/common'

export interface EmailTemplateData {
  userName?: string
  otpCode?: string
  validationUrl?: string
  companyName?: string
  logoUrl?: string
  primaryColor?: string
  secondaryColor?: string
  otpExpirationMinutes?: number
}

@Injectable()
export class EmailTemplatesService {
  private readonly defaultColors = {
    primary: '#2563eb',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#f8fafc',
    white: '#ffffff',
    text: '#1e293b',
    textLight: '#64748b',
  }

  generateOtpEmail(data: EmailTemplateData): string {
    const colors = this.defaultColors
    const companyName = data.companyName || 'BTG OTP System'
    const userName = data.userName || 'Usuário'
    const otpCode = data.otpCode
    const otpExpirationMinutes = data.otpExpirationMinutes || 10
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Token de Acesso - ${companyName}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: ${colors.background};
            color: ${colors.text};
            line-height: 1.6;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: ${colors.white};
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            margin-top: 20px;
            margin-bottom: 20px;
          }
          
          .header {
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
            padding: 40px 30px;
            text-align: center;
            color: ${colors.white};
          }
          
          .header h1 {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 10px;
          }
          
          .header p {
            font-size: 16px;
            opacity: 0.9;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .greeting {
            font-size: 18px;
            color: ${colors.text};
            margin-bottom: 30px;
          }
          
          .otp-container {
            background: linear-gradient(135deg, ${colors.background} 0%, ${colors.white} 100%);
            border: 2px solid ${colors.primary};
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
          }
          
          .otp-code {
            font-size: 48px;
            font-weight: 700;
            color: ${colors.primary};
            letter-spacing: 8px;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
          }
          
          .otp-label {
            font-size: 14px;
            color: ${colors.textLight};
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
          }
          
          .info-text {
            font-size: 16px;
            color: ${colors.text};
            margin-bottom: 20px;
            text-align: center;
          }
          
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
            color: ${colors.white};
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
          }
          
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
          }
          
          .footer {
            background-color: ${colors.background};
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          
          .footer p {
            color: ${colors.textLight};
            font-size: 14px;
            margin-bottom: 10px;
          }
          
          .security-note {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
          }
          
          .security-note p {
            color: #92400e;
            font-size: 14px;
            margin: 0;
          }
          
          .security-icon {
            font-size: 20px;
            margin-right: 8px;
          }
          
          @media (max-width: 600px) {
            .container {
              margin: 10px;
              border-radius: 8px;
            }
            
            .header, .content, .footer {
              padding: 20px;
            }
            
            .otp-code {
              font-size: 36px;
              letter-spacing: 6px;
            }
            
            .header h1 {
              font-size: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Token de Acesso</h1>
            <p>${companyName}</p>
          </div>
          
          <div class="content">
            <div class="greeting">
              Olá, <strong>${userName}</strong>!
            </div>
            
            <p class="info-text">
              Você solicitou um token de acesso para sua conta. Use o código abaixo para continuar:
            </p>
            
            <div class="otp-container">
              <div class="otp-label">Código de Verificação</div>
              <div class="otp-code">${otpCode}</div>
              <p style="font-size: 14px; color: ${colors.textLight}; margin: 0;">
                Este código expira em ${otpExpirationMinutes} minutos
              </p>
            </div>
            
            <div class="security-note">
              <span class="security-icon">⚠️</span>
              <strong>Importante:</strong> Nunca compartilhe este código com ninguém. 
              Nossa equipe nunca solicitará este código por telefone ou email.
            </div>
            
            <p class="info-text">
              Se você não solicitou este token, ignore este email ou entre em contato conosco.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>${companyName}</strong></p>
            <p>Este é um email automático, não responda a esta mensagem.</p>
            <p>© ${new Date().getFullYear()} ${companyName}. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  generateWelcomeEmail(data: EmailTemplateData): string {
    const colors = this.defaultColors
    const companyName = data.companyName || 'BTG OTP System'
    const userName = data.userName || 'Usuário'

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo - ${companyName}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: ${colors.background};
            color: ${colors.text};
            line-height: 1.6;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: ${colors.white};
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            margin-top: 20px;
            margin-bottom: 20px;
          }
          
          .header {
            background: linear-gradient(135deg, ${colors.success} 0%, ${colors.primary} 100%);
            padding: 40px 30px;
            text-align: center;
            color: ${colors.white};
          }
          
          .header h1 {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 10px;
          }
          
          .header p {
            font-size: 16px;
            opacity: 0.9;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .greeting {
            font-size: 18px;
            color: ${colors.text};
            margin-bottom: 30px;
          }
          
          .welcome-icon {
            font-size: 64px;
            text-align: center;
            margin: 20px 0;
          }
          
          .info-text {
            font-size: 16px;
            color: ${colors.text};
            margin-bottom: 20px;
            text-align: center;
          }
          
          .features {
            background-color: ${colors.background};
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          
          .feature-item {
            display: flex;
            align-items: center;
            margin: 15px 0;
            padding: 10px;
            background-color: ${colors.white};
            border-radius: 6px;
            border-left: 4px solid ${colors.primary};
          }
          
          .feature-icon {
            font-size: 20px;
            margin-right: 15px;
            color: ${colors.primary};
          }
          
          .footer {
            background-color: ${colors.background};
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          
          .footer p {
            color: ${colors.textLight};
            font-size: 14px;
            margin-bottom: 10px;
          }
          
          @media (max-width: 600px) {
            .container {
              margin: 10px;
              border-radius: 8px;
            }
            
            .header, .content, .footer {
              padding: 20px;
            }
            
            .header h1 {
              font-size: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bem-vindo!</h1>
            <p>${companyName}</p>
          </div>
          
          <div class="content">
            <div class="greeting">
              Olá, <strong>${userName}</strong>! 👋
            </div>
            
            <div class="welcome-icon">🎯</div>
            
            <p class="info-text">
              Estamos muito felizes em tê-lo conosco! Sua conta foi criada com sucesso.
            </p>
            
            <div class="features">
              <h3 style="margin-bottom: 20px; color: ${colors.primary}; text-align: center;">
                O que você pode fazer agora:
              </h3>
              
              <div class="feature-item">
                <span class="feature-icon">🔐</span>
                <span>Fazer login com autenticação OTP segura</span>
              </div>
              
              <div class="feature-item">
                <span class="feature-icon">📱</span>
                <span>Receber tokens de acesso por email</span>
              </div>
              
              <div class="feature-item">
                <span class="feature-icon">⚡</span>
                <span>Acessar recursos protegidos da plataforma</span>
              </div>
              
              <div class="feature-item">
                <span class="feature-icon">🛡️</span>
                <span>Beneficiar-se de nossa segurança de nível empresarial</span>
              </div>
            </div>
            
            <p class="info-text">
              Seus dados estão seguros conosco. Em caso de dúvidas, nossa equipe de suporte está sempre disponível para ajudar.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>${companyName}</strong></p>
            <p>Este é um email automático, não responda a esta mensagem.</p>
            <p>© ${new Date().getFullYear()} ${companyName}. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  generatePasswordResetEmail(data: EmailTemplateData): string {
    const colors = this.defaultColors
    const companyName = data.companyName || 'BTG OTP System'
    const userName = data.userName || 'Usuário'
    const otpCode = data.otpCode || '123456'

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinição de Senha - ${companyName}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: ${colors.background};
            color: ${colors.text};
            line-height: 1.6;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: ${colors.white};
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            margin-top: 20px;
            margin-bottom: 20px;
          }
          
          .header {
            background: linear-gradient(135deg, ${colors.warning} 0%, ${colors.primary} 100%);
            padding: 40px 30px;
            text-align: center;
            color: ${colors.white};
          }
          
          .header h1 {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 10px;
          }
          
          .header p {
            font-size: 16px;
            opacity: 0.9;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .greeting {
            font-size: 18px;
            color: ${colors.text};
            margin-bottom: 30px;
          }
          
          .otp-container {
            background: linear-gradient(135deg, ${colors.background} 0%, ${colors.white} 100%);
            border: 2px solid ${colors.warning};
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
          }
          
          .otp-code {
            font-size: 48px;
            font-weight: 700;
            color: ${colors.warning};
            letter-spacing: 8px;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
          }
          
          .otp-label {
            font-size: 14px;
            color: ${colors.textLight};
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
          }
          
          .info-text {
            font-size: 16px;
            color: ${colors.text};
            margin-bottom: 20px;
            text-align: center;
          }
          
          .security-note {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
          }
          
          .security-note p {
            color: #92400e;
            font-size: 14px;
            margin: 0;
          }
          
          .security-icon {
            font-size: 20px;
            margin-right: 8px;
          }
          
          .footer {
            background-color: ${colors.background};
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          
          .footer p {
            color: ${colors.textLight};
            font-size: 14px;
            margin-bottom: 10px;
          }
          
          @media (max-width: 600px) {
            .container {
              margin: 10px;
              border-radius: 8px;
            }
            
            .header, .content, .footer {
              padding: 20px;
            }
            
            .otp-code {
              font-size: 36px;
              letter-spacing: 6px;
            }
            
            .header h1 {
              font-size: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 Redefinição de Senha</h1>
            <p>${companyName}</p>
          </div>
          
          <div class="content">
            <div class="greeting">
              Olá, <strong>${userName}</strong>! 👋
            </div>
            
            <p class="info-text">
              Recebemos uma solicitação para redefinir a senha da sua conta. Use o código abaixo para continuar:
            </p>
            
            <div class="otp-container">
              <div class="otp-label">Código de Verificação</div>
              <div class="otp-code">${otpCode}</div>
              <p style="font-size: 14px; color: ${colors.textLight}; margin: 0;">
                Este código expira em 10 minutos
              </p>
            </div>
            
            <div class="security-note">
              <span class="security-icon">⚠️</span>
              <strong>Importante:</strong> Se você não solicitou a redefinição de senha, 
              ignore este email e sua senha atual permanecerá inalterada.
            </div>
            
            <p class="info-text">
              Após usar este código, você poderá definir uma nova senha segura para sua conta.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>${companyName}</strong></p>
            <p>Este é um email automático, não responda a esta mensagem.</p>
            <p>© ${new Date().getFullYear()} ${companyName}. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}
