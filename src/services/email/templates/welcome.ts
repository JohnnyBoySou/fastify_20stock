import type { WelcomeEmailData } from '../email.service'

export const generateWelcomeEmailHTML = (data: WelcomeEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bem-vindo ao 25Stock</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Bem-vindo ao 25Stock!</h1>
          <p>Sua conta foi criada com sucesso</p>
        </div>
        <div class="content">
          <h2>Olá, ${data.name}!</h2>
          <p>É um prazer tê-lo conosco no 25Stock, a plataforma completa para gestão de estoque.</p>
          <p>Com sua conta, você poderá:</p>
          <ul>
            <li>Gerenciar produtos e categorias</li>
            <li>Controlar movimentações de estoque</li>
            <li>Gerar relatórios detalhados</li>
            <li>Colaborar com sua equipe</li>
            <li>E muito mais!</li>
          </ul>
          <p>Clique no botão abaixo para acessar sua conta:</p>
          <a href="${data.loginUrl}" class="button">Acessar Minha Conta</a>
          <p>Se você não criou esta conta, pode ignorar este email.</p>
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

export const generateWelcomeEmailText = (data: WelcomeEmailData): string => {
  return `
Bem-vindo ao 25Stock!

Olá, ${data.name}!

É um prazer tê-lo conosco no 25Stock, a plataforma completa para gestão de estoque.

Com sua conta, você poderá:
- Gerenciar produtos e categorias
- Controlar movimentações de estoque
- Gerar relatórios detalhados
- Colaborar com sua equipe
- E muito mais!

Acesse sua conta em: ${data.loginUrl}

Se você não criou esta conta, pode ignorar este email.

---
Este é um email automático, não responda a esta mensagem.
© 2024 25Stock. Todos os direitos reservados.
  `
}
