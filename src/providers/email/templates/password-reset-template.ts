import {
  EmailTemplateData,
  defaultColors,
  generateBaseTemplate,
} from './base-template'

export const generatePasswordResetEmail = (data: EmailTemplateData): string => {
  const colors = defaultColors
  const companyName = data.companyName || 'BTG OTP System'
  const userName = data.userName || 'Usuário'
  const otpCode = data.otpCode || '123456'

  const passwordResetStyles = `
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
    
    @media (max-width: 600px) {
      .otp-code {
        font-size: 36px;
        letter-spacing: 6px;
      }
    }
  `

  const content = `
    <style>
      ${passwordResetStyles}
    </style>
    
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
  `

  return generateBaseTemplate(
    '🔑 Redefinição de Senha',
    companyName,
    `linear-gradient(135deg, ${colors.warning} 0%, ${colors.primary} 100%)`,
    content,
    colors,
  )
}
