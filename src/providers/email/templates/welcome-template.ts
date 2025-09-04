import {
  EmailTemplateData,
  defaultColors,
  generateBaseTemplate,
} from './base-template'

export const generateWelcomeEmail = (data: EmailTemplateData): string => {
  const colors = defaultColors
  const companyName = data.companyName || 'BTG OTP System'
  const userName = data.userName || 'Usuário'

  const welcomeStyles = `
    .welcome-icon {
      font-size: 64px;
      text-align: center;
      margin: 20px 0;
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
  `

  const content = `
    <style>
      ${welcomeStyles}
    </style>
    
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
  `

  return generateBaseTemplate(
    '🎉 Bem-vindo!',
    companyName,
    `linear-gradient(135deg, ${colors.success} 0%, ${colors.primary} 100%)`,
    content,
    colors,
  )
}
