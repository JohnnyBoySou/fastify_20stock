export const generateEmailVerificationHTML = (data) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmação de Email - 25Stock</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .code-container { background: #fff; border: 2px solid #667eea; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
        .verification-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 10px 0; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Confirmação de Email</h1>
          <p>25Stock - Sistema de Gestão de Estoque</p>
        </div>
        <div class="content">
          <h2>Olá, ${data.name}!</h2>
          <p>Bem-vindo ao 25Stock! Para confirmar sua conta, use o código de verificação abaixo:</p>
          
          <div class="code-container">
            <p style="margin: 0 0 10px 0; font-size: 18px; color: #666;">Seu código de verificação é:</p>
            <div class="verification-code">${data.verificationCode}</div>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">Este código expira em ${data.expiresIn}</p>
          </div>

          <p>Digite este código no aplicativo para confirmar seu email e ativar sua conta.</p>
          
          <div class="warning">
            <strong>⚠️ Importante:</strong>
            <ul>
              <li>Este código é válido por ${data.expiresIn}</li>
              <li>Não compartilhe este código com ninguém</li>
              <li>Se você não solicitou esta conta, ignore este email</li>
            </ul>
          </div>

          <p>Se você não conseguir usar o código, pode solicitar um novo código de verificação no aplicativo.</p>
        </div>
        <div class="footer">
          <p>Este é um email automático, não responda a esta mensagem.</p>
          <p>&copy; 2024 25Stock. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
export const generateEmailVerificationText = (data) => {
    return `
Confirmação de Email - 25Stock

Olá, ${data.name}!

Bem-vindo ao 25Stock! Para confirmar sua conta, use o código de verificação abaixo:

CÓDIGO DE VERIFICAÇÃO: ${data.verificationCode}

Este código expira em ${data.expiresIn}

Digite este código no aplicativo para confirmar seu email e ativar sua conta.

IMPORTANTE:
- Este código é válido por ${data.expiresIn}
- Não compartilhe este código com ninguém
- Se você não solicitou esta conta, ignore este email

Se você não conseguir usar o código, pode solicitar um novo código de verificação no aplicativo.

---
Este é um email automático, não responda a esta mensagem.
© 2024 25Stock. Todos os direitos reservados.
  `;
};
