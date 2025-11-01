import { type InvoicePdfData, InvoicePdfService } from '../pdf/invoice-pdf.service'

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

export interface EmailConfig {
  from: string
  replyTo?: string
  companyName: string
  supportEmail: string
  website?: string
}

export class InvoiceEmailService {
  private pdfService: InvoicePdfService
  private config: EmailConfig

  constructor() {
    this.pdfService = new InvoicePdfService()
    this.config = {
      from: process.env.EMAIL_FROM || 'noreply@20stock.com',
      replyTo: process.env.EMAIL_REPLY_TO || 'suporte@20stock.com',
      companyName: '20Stock',
      supportEmail: 'suporte@20stock.com',
      website: 'https://20stock.com',
    }
  }

  async sendInvoiceEmail(
    invoiceData: InvoicePdfData,
    recipientEmail?: string,
    includePdf = true
  ): Promise<EmailResult> {
    try {
      const email = recipientEmail || invoiceData.customer.email

      // Gerar template do email
      const template = this.generateInvoiceEmailTemplate(invoiceData)

      // Gerar PDF se solicitado
      let pdfBuffer: Buffer | undefined
      if (includePdf) {
        const pdfResult = await this.pdfService.generateInvoicePdf(invoiceData)
        if (pdfResult.success && pdfResult.buffer) {
          pdfBuffer = pdfResult.buffer
        }
      }

      // Em uma implementação real, aqui seria usado um serviço de email como SendGrid, AWS SES, etc.
      // Por enquanto, simulamos o envio
      console.log(`Sending invoice email to ${email}:`, {
        subject: template.subject,
        hasPdf: !!pdfBuffer,
        invoiceId: invoiceData.invoice.id,
      })

      const messageId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return {
        success: true,
        messageId,
      }
    } catch (error) {
      console.error('Error sending invoice email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async sendPaymentConfirmation(
    invoiceData: InvoicePdfData,
    paymentDetails: {
      paymentId: string
      paymentMethod: string
      paymentDate: Date
    }
  ): Promise<EmailResult> {
    try {
      const template = this.generatePaymentConfirmationTemplate(invoiceData, paymentDetails)

      console.log(`Sending payment confirmation to ${invoiceData.customer.email}:`, {
        subject: template.subject,
        paymentId: paymentDetails.paymentId,
        invoiceId: invoiceData.invoice.id,
      })

      const messageId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return {
        success: true,
        messageId,
      }
    } catch (error) {
      console.error('Error sending payment confirmation:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async sendPaymentFailed(
    invoiceData: InvoicePdfData,
    errorDetails: {
      error: string
      retryUrl?: string
    }
  ): Promise<EmailResult> {
    try {
      const template = this.generatePaymentFailedTemplate(invoiceData, errorDetails)

      console.log(`Sending payment failed notification to ${invoiceData.customer.email}:`, {
        subject: template.subject,
        error: errorDetails.error,
        invoiceId: invoiceData.invoice.id,
      })

      const messageId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return {
        success: true,
        messageId,
      }
    } catch (error) {
      console.error('Error sending payment failed email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async sendTrialEnding(
    customerData: {
      name: string
      email: string
    },
    trialDetails: {
      planName: string
      daysRemaining: number
      renewalDate: Date
    }
  ): Promise<EmailResult> {
    try {
      const template = this.generateTrialEndingTemplate(customerData, trialDetails)

      console.log(`Sending trial ending notification to ${customerData.email}:`, {
        subject: template.subject,
        daysRemaining: trialDetails.daysRemaining,
        planName: trialDetails.planName,
      })

      const messageId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return {
        success: true,
        messageId,
      }
    } catch (error) {
      console.error('Error sending trial ending email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async sendSubscriptionCancelled(
    customerData: {
      name: string
      email: string
    },
    cancellationDetails: {
      planName: string
      cancellationDate: Date
      accessUntil: Date
      reason?: string
    }
  ): Promise<EmailResult> {
    try {
      const template = this.generateSubscriptionCancelledTemplate(customerData, cancellationDetails)

      console.log(`Sending subscription cancelled notification to ${customerData.email}:`, {
        subject: template.subject,
        planName: cancellationDetails.planName,
        accessUntil: cancellationDetails.accessUntil,
      })

      const messageId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return {
        success: true,
        messageId,
      }
    } catch (error) {
      console.error('Error sending subscription cancelled email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  private generateInvoiceEmailTemplate(invoiceData: InvoicePdfData): EmailTemplate {
    const subject = `Fatura #${invoiceData.invoice.id} - ${this.config.companyName}`

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .invoice-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .amount { font-size: 24px; font-weight: bold; color: #28a745; text-align: center; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
        .button { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${this.config.companyName}</h1>
            <h2>Fatura #${invoiceData.invoice.id}</h2>
        </div>
        
        <div class="content">
            <p>Olá, ${invoiceData.customer.name}!</p>
            
            <p>Você recebeu uma nova fatura em sua conta. Aqui estão os detalhes:</p>
            
            <div class="invoice-details">
                <h3>Detalhes da Fatura</h3>
                ${
                  invoiceData.plan
                    ? `
                <p><strong>Plano:</strong> ${invoiceData.plan.name}</p>
                ${invoiceData.plan.description ? `<p><strong>Descrição:</strong> ${invoiceData.plan.description}</p>` : ''}
                <p><strong>Valor do Plano:</strong> R$ ${invoiceData.plan.price.toFixed(2)} (${invoiceData.plan.interval})</p>
                `
                    : ''
                }
                <p><strong>Data de Criação:</strong> ${invoiceData.invoice.createdAt.toLocaleDateString('pt-BR')}</p>
                <p><strong>Status:</strong> ${invoiceData.invoice.status}</p>
                
                <div class="amount">
                    VALOR TOTAL: R$ ${invoiceData.invoice.amount.toFixed(2)}
                </div>
            </div>
            
            <p style="text-align: center;">
                <a href="${this.config.website}/invoice/${invoiceData.invoice.id}" class="button">
                    Ver Fatura Completa
                </a>
            </p>
            
            <p>Se você tiver alguma dúvida, entre em contato conosco em ${this.config.supportEmail}.</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} ${this.config.companyName}. Todos os direitos reservados.</p>
            <p>Este é um email automático, por favor não responda.</p>
        </div>
    </div>
</body>
</html>
    `

    const text = `
${this.config.companyName} - Fatura #${invoiceData.invoice.id}

Olá, ${invoiceData.customer.name}!

Você recebeu uma nova fatura em sua conta. Aqui estão os detalhes:

${
  invoiceData.plan
    ? `
Plano: ${invoiceData.plan.name}
${invoiceData.plan.description ? `Descrição: ${invoiceData.plan.description}` : ''}
Valor do Plano: R$ ${invoiceData.plan.price.toFixed(2)} (${invoiceData.plan.interval})
`
    : ''
}
Data de Criação: ${invoiceData.invoice.createdAt.toLocaleDateString('pt-BR')}
Status: ${invoiceData.invoice.status}

VALOR TOTAL: R$ ${invoiceData.invoice.amount.toFixed(2)}

Para ver a fatura completa, acesse: ${this.config.website}/invoice/${invoiceData.invoice.id}

Se você tiver alguma dúvida, entre em contato conosco em ${this.config.supportEmail}.

© ${new Date().getFullYear()} ${this.config.companyName}. Todos os direitos reservados.
    `

    return { subject, html, text }
  }

  private generatePaymentConfirmationTemplate(
    invoiceData: InvoicePdfData,
    paymentDetails: any
  ): EmailTemplate {
    const subject = `Pagamento Confirmado - Fatura #${invoiceData.invoice.id}`

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .payment-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Pagamento Confirmado!</h1>
        </div>
        
        <div class="content">
            <p>Olá, ${invoiceData.customer.name}!</p>
            
            <div class="success">
                <strong>Seu pagamento foi processado com sucesso!</strong>
            </div>
            
            <div class="payment-details">
                <h3>Detalhes do Pagamento</h3>
                <p><strong>Fatura:</strong> #${invoiceData.invoice.id}</p>
                <p><strong>Valor Pago:</strong> R$ ${invoiceData.invoice.amount.toFixed(2)}</p>
                <p><strong>Método de Pagamento:</strong> ${paymentDetails.paymentMethod}</p>
                <p><strong>Data do Pagamento:</strong> ${paymentDetails.paymentDate.toLocaleDateString('pt-BR')}</p>
                <p><strong>ID do Pagamento:</strong> ${paymentDetails.paymentId}</p>
            </div>
            
            <p>Obrigado por escolher nossos serviços! Sua assinatura está ativa.</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} ${this.config.companyName}. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>
    `

    const text = `
Pagamento Confirmado - Fatura #${invoiceData.invoice.id}

Olá, ${invoiceData.customer.name}!

✅ Seu pagamento foi processado com sucesso!

Detalhes do Pagamento:
- Fatura: #${invoiceData.invoice.id}
- Valor Pago: R$ ${invoiceData.invoice.amount.toFixed(2)}
- Método de Pagamento: ${paymentDetails.paymentMethod}
- Data do Pagamento: ${paymentDetails.paymentDate.toLocaleDateString('pt-BR')}
- ID do Pagamento: ${paymentDetails.paymentId}

Obrigado por escolher nossos serviços! Sua assinatura está ativa.

© ${new Date().getFullYear()} ${this.config.companyName}. Todos os direitos reservados.
    `

    return { subject, html, text }
  }

  private generatePaymentFailedTemplate(
    invoiceData: InvoicePdfData,
    errorDetails: any
  ): EmailTemplate {
    const subject = `Falha no Pagamento - Fatura #${invoiceData.invoice.id}`

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .error { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .invoice-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .button { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ Falha no Pagamento</h1>
        </div>
        
        <div class="content">
            <p>Olá, ${invoiceData.customer.name}!</p>
            
            <div class="error">
                <strong>Não foi possível processar seu pagamento.</strong>
                <br>
                Erro: ${errorDetails.error}
            </div>
            
            <div class="invoice-details">
                <h3>Detalhes da Fatura</h3>
                <p><strong>Fatura:</strong> #${invoiceData.invoice.id}</p>
                <p><strong>Valor:</strong> R$ ${invoiceData.invoice.amount.toFixed(2)}</p>
                <p><strong>Vencimento:</strong> ${invoiceData.invoice.createdAt.toLocaleDateString('pt-BR')}</p>
            </div>
            
            <p style="text-align: center;">
                ${
                  errorDetails.retryUrl
                    ? `
                <a href="${errorDetails.retryUrl}" class="button">
                    Tentar Pagamento Novamente
                </a>
                `
                    : `
                <a href="${this.config.website}/invoice/${invoiceData.invoice.id}" class="button">
                    Ver Fatura
                </a>
                `
                }
            </p>
            
            <p>Se você precisar de ajuda, entre em contato conosco em ${this.config.supportEmail}.</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} ${this.config.companyName}. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>
    `

    const text = `
Falha no Pagamento - Fatura #${invoiceData.invoice.id}

Olá, ${invoiceData.customer.name}!

⚠️ Não foi possível processar seu pagamento.

Erro: ${errorDetails.error}

Detalhes da Fatura:
- Fatura: #${invoiceData.invoice.id}
- Valor: R$ ${invoiceData.invoice.amount.toFixed(2)}
- Vencimento: ${invoiceData.invoice.createdAt.toLocaleDateString('pt-BR')}

${errorDetails.retryUrl ? `Para tentar o pagamento novamente, acesse: ${errorDetails.retryUrl}` : `Para ver a fatura, acesse: ${this.config.website}/invoice/${invoiceData.invoice.id}`}

Se você precisar de ajuda, entre em contato conosco em ${this.config.supportEmail}.

© ${new Date().getFullYear()} ${this.config.companyName}. Todos os direitos reservados.
    `

    return { subject, html, text }
  }

  private generateTrialEndingTemplate(customerData: any, trialDetails: any): EmailTemplate {
    const subject = `Seu período de teste está terminando em ${trialDetails.daysRemaining} dias`

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ffc107; color: #333; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .warning { background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .button { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⏰ Período de Teste Terminando</h1>
        </div>
        
        <div class="content">
            <p>Olá, ${customerData.name}!</p>
            
            <div class="warning">
                <strong>Seu período de teste está terminando em ${trialDetails.daysRemaining} dias!</strong>
            </div>
            
            <p>Você está usando o plano <strong>${trialDetails.planName}</strong> em período de teste.</p>
            <p>Para continuar usando nossos serviços após o período de teste, você precisará ativar sua assinatura.</p>
            
            <p style="text-align: center;">
                <a href="${this.config.website}/plans" class="button">
                    Escolher Plano
                </a>
            </p>
            
            <p>Data de renovação: ${trialDetails.renewalDate.toLocaleDateString('pt-BR')}</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} ${this.config.companyName}. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>
    `

    const text = `
Seu período de teste está terminando em ${trialDetails.daysRemaining} dias

Olá, ${customerData.name}!

⏰ Seu período de teste está terminando em ${trialDetails.daysRemaining} dias!

Você está usando o plano ${trialDetails.planName} em período de teste.

Para continuar usando nossos serviços após o período de teste, você precisará ativar sua assinatura.

Acesse: ${this.config.website}/plans

Data de renovação: ${trialDetails.renewalDate.toLocaleDateString('pt-BR')}

© ${new Date().getFullYear()} ${this.config.companyName}. Todos os direitos reservados.
    `

    return { subject, html, text }
  }

  private generateSubscriptionCancelledTemplate(
    customerData: any,
    cancellationDetails: any
  ): EmailTemplate {
    const subject = `Assinatura Cancelada - ${cancellationDetails.planName}`

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #6c757d; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .info { background: #d1ecf1; color: #0c5460; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .button { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Assinatura Cancelada</h1>
        </div>
        
        <div class="content">
            <p>Olá, ${customerData.name}!</p>
            
            <div class="info">
                <strong>Sua assinatura foi cancelada com sucesso.</strong>
            </div>
            
            <p><strong>Plano:</strong> ${cancellationDetails.planName}</p>
            <p><strong>Data do Cancelamento:</strong> ${cancellationDetails.cancellationDate.toLocaleDateString('pt-BR')}</p>
            <p><strong>Acesso até:</strong> ${cancellationDetails.accessUntil.toLocaleDateString('pt-BR')}</p>
            ${cancellationDetails.reason ? `<p><strong>Motivo:</strong> ${cancellationDetails.reason}</p>` : ''}
            
            <p>Você ainda terá acesso aos nossos serviços até <strong>${cancellationDetails.accessUntil.toLocaleDateString('pt-BR')}</strong>.</p>
            
            <p style="text-align: center;">
                <a href="${this.config.website}/plans" class="button">
                    Reativar Assinatura
                </a>
            </p>
            
            <p>Esperamos poder atendê-lo novamente no futuro!</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} ${this.config.companyName}. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>
    `

    const text = `
Assinatura Cancelada - ${cancellationDetails.planName}

Olá, ${customerData.name}!

📋 Sua assinatura foi cancelada com sucesso.

Plano: ${cancellationDetails.planName}
Data do Cancelamento: ${cancellationDetails.cancellationDate.toLocaleDateString('pt-BR')}
Acesso até: ${cancellationDetails.accessUntil.toLocaleDateString('pt-BR')}
${cancellationDetails.reason ? `Motivo: ${cancellationDetails.reason}` : ''}

Você ainda terá acesso aos nossos serviços até ${cancellationDetails.accessUntil.toLocaleDateString('pt-BR')}.

Para reativar sua assinatura, acesse: ${this.config.website}/plans

Esperamos poder atendê-lo novamente no futuro!

© ${new Date().getFullYear()} ${this.config.companyName}. Todos os direitos reservados.
    `

    return { subject, html, text }
  }
}
