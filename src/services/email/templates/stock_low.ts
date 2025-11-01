import type { NotificationEmailData } from '../email.service'

export const generateStockLowEmailHTML = (data: NotificationEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.title} - 25Stock</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #f39c12; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ ${data.title}</h1>
          <p>25Stock - Sistema de Gestão de Estoque</p>
        </div>
        <div class="content">
          <h2>Olá, ${data.name}!</h2>
          <div class="warning">
            <strong>🚨 Atenção:</strong>
            <p>${data.message}</p>
          </div>
          <p>É recomendado que você faça um novo pedido para este produto o quanto antes para evitar a falta de estoque.</p>
          ${data.actionUrl ? `<a href="${data.actionUrl}" class="button">${data.actionText || 'Ver Produto'}</a>` : ''}
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

export const generateStockLowEmailText = (data: NotificationEmailData): string => {
  return `
${data.title} - 25Stock

Olá, ${data.name}!

🚨 ATENÇÃO: ${data.message}

É recomendado que você faça um novo pedido para este produto o quanto antes para evitar a falta de estoque.

${data.actionUrl ? `Acesse: ${data.actionUrl}` : ''}

---
Este é um email automático, não responda a esta mensagem.
© 2024 25Stock. Todos os direitos reservados.
  `
}
