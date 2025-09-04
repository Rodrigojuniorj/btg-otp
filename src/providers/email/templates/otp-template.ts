import { EmailTemplateData, defaultColors, baseStyles } from './base-template'

export const generateOtpEmail = (data: EmailTemplateData): string => {
  const colors = defaultColors
  const companyName = data.companyName || 'BTG OTP System'
  const userName = data.userName || 'Usuário'
  const otpCode = data.otpCode
  const otpExpirationMinutes = data.otpExpirationMinutes || 10

  const otpStyles = `
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
    
    @media (max-width: 600px) {
      .otp-code {
        font-size: 36px;
        letter-spacing: 6px;
      }
    }
  `

  const content = `
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
  `

  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Token de Acesso - ${companyName}</title>
    <style>
      ${baseStyles(colors)}
      ${otpStyles}
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header" style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);">
        <h1>Token de Acesso</h1>
        <p>${companyName}</p>
      </div>
      
      <div class="content">
        ${content}
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
