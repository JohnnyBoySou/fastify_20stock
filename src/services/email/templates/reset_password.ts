import type { PasswordResetEmailData } from '../email.service'

export const generatePasswordResetEmailHTML = (data: PasswordResetEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Redefinição de Senha - 25Stock</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .code-box { background: #fff; border: 2px solid #e74c3c; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0; }
        .reset-code { font-size: 32px; font-weight: bold; color: #e74c3c; letter-spacing: 5px; margin: 10px 0; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Redefinição de Senha</h1>
          <p>25Stock - Sistema de Gestão de Estoque</p>
        </div>
        <div class="content">
          <h2>Olá, ${data.name}!</h2>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta no 25Stock.</p>
          <p>Use o código abaixo para redefinir sua senha:</p>
          <div class="code-box">
            <p style="margin: 0 0 10px 0; color: #666;">Seu código de redefinição:</p>
            <div class="reset-code">${data.resetCode}</div>
          </div>
          <div class="warning">
            <strong>⚠️ Importante:</strong>
            <ul>
              <li>Este código expira em ${data.expiresIn}</li>
              <li>Se você não solicitou esta redefinição, ignore este email</li>
              <li>Sua senha atual continuará funcionando até ser alterada</li>
              <li>Não compartilhe este código com ninguém</li>
            </ul>
          </div>
          <p>Digite este código na tela de redefinição de senha do aplicativo.</p>
        </div>
        <div class="footer">
          <p>Este é um email automático, não responda a esta mensagem.</p>
          <p>&copy; 2024 25Stock. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export const generatePasswordResetEmailText = (data: PasswordResetEmailData): string => {
  return `
Redefinição de Senha - 25Stock

Olá, ${data.name}!

Recebemos uma solicitação para redefinir a senha da sua conta no 25Stock.

Use o código abaixo para redefinir sua senha:

SEU CÓDIGO DE REDEFINIÇÃO: ${data.resetCode}

IMPORTANTE:
- Este código expira em ${data.expiresIn}
- Se você não solicitou esta redefinição, ignore este email
- Sua senha atual continuará funcionando até ser alterada
- Não compartilhe este código com ninguém

Digite este código na tela de redefinição de senha do aplicativo.

---
Este é um email automático, não responda a esta mensagem.
© 2024 25Stock. Todos os direitos reservados.
  `
}
