import { StoreInviteEmailData } from '../email.service'

export const generateStoreInviteEmailHTML = (data: StoreInviteEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Convite para Loja - 25Stock</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .info { background: #e8f5e8; border: 1px solid #27ae60; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏪 Convite para Loja</h1>
          <p>25Stock - Sistema de Gestão de Estoque</p>
        </div>
        <div class="content">
          <h2>Olá, ${data.name}!</h2>
          <p><strong>${data.inviterName}</strong> convidou você para colaborar na loja <strong>"${data.storeName}"</strong> no 25Stock.</p>
          <div class="info">
            <strong>📋 Detalhes do Convite:</strong>
            <ul>
              <li><strong>Loja:</strong> ${data.storeName}</li>
              <li><strong>Convidado por:</strong> ${data.inviterName}</li>
              <li><strong>Expira em:</strong> ${data.expiresIn}</li>
            </ul>
          </div>
          <p>Clique no botão abaixo para aceitar o convite:</p>
          <a href="${data.acceptUrl}" class="button">Aceitar Convite</a>
          <p>Se você não conhece esta pessoa ou não deseja participar desta loja, pode ignorar este email.</p>
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

export const generateStoreInviteEmailText = (data: StoreInviteEmailData): string => {
  return `
Convite para Loja - 25Stock

Olá, ${data.name}!

${data.inviterName} convidou você para colaborar na loja "${data.storeName}" no 25Stock.

Detalhes do Convite:
- Loja: ${data.storeName}
- Convidado por: ${data.inviterName}
- Expira em: ${data.expiresIn}

Aceite o convite em: ${data.acceptUrl}

Se você não conhece esta pessoa ou não deseja participar desta loja, pode ignorar este email.

---
Este é um email automático, não responda a esta mensagem.
© 2024 25Stock. Todos os direitos reservados.
  `
}
