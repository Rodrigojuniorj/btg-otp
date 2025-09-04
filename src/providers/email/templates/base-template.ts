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

export const defaultColors = {
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

export const baseStyles = (colors: typeof defaultColors) => `
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
  
  .info-text {
    font-size: 16px;
    color: ${colors.text};
    margin-bottom: 20px;
    text-align: center;
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
    
    .header h1 {
      font-size: 24px;
    }
  }
`

export const generateBaseTemplate = (
  title: string,
  companyName: string,
  headerGradient: string,
  content: string,
  colors: typeof defaultColors = defaultColors,
): string => `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - ${companyName}</title>
    <style>
      ${baseStyles(colors)}
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header" style="background: ${headerGradient};">
        <h1>${title}</h1>
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
