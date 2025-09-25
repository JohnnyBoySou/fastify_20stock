"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const resend_1 = require("resend");
const templates_1 = require("./templates");
// Configuração do Resend
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
exports.EmailService = {
    /**
     * Envia email de boas-vindas para novos usuários
     */
    sendWelcomeEmail: async (data) => {
        try {
            const html = (0, templates_1.generateWelcomeEmailHTML)(data);
            const text = (0, templates_1.generateWelcomeEmailText)(data);
            const result = await resend.emails.send({
                from: process.env.FROM_EMAIL || 'noreply@25stock.com',
                to: data.email,
                subject: `Bem-vindo ao 25Stock, ${data.name}!`,
                html,
                text
            });
            console.log('Welcome email sent:', result.data?.id);
            return true;
        }
        catch (error) {
            console.error('Error sending welcome email:', error);
            return false;
        }
    },
    /**
     * Envia email de redefinição de senha
     */
    sendPasswordResetEmail: async (data) => {
        try {
            const html = (0, templates_1.generatePasswordResetEmailHTML)(data);
            const text = (0, templates_1.generatePasswordResetEmailText)(data);
            const result = await resend.emails.send({
                from: process.env.FROM_EMAIL || 'noreply@25stock.com',
                to: data.email,
                subject: 'Redefinição de senha - 25Stock',
                html,
                text
            });
            console.log('Password reset email sent:', result.data?.id);
            return true;
        }
        catch (error) {
            console.error('Error sending password reset email:', error);
            return false;
        }
    },
    /**
     * Envia email de notificação
     */
    sendNotificationEmail: async (data) => {
        try {
            const html = (0, templates_1.generateNotificationEmailHTML)(data);
            const text = (0, templates_1.generateNotificationEmailText)(data);
            const result = await resend.emails.send({
                from: process.env.FROM_EMAIL || 'noreply@25stock.com',
                to: data.email,
                subject: `Notificação - ${data.title}`,
                html,
                text
            });
            console.log('Notification email sent:', result.data?.id);
            return true;
        }
        catch (error) {
            console.error('Error sending notification email:', error);
            return false;
        }
    },
    /**
     * Envia convite para loja
     */
    sendStoreInviteEmail: async (data) => {
        try {
            const html = (0, templates_1.generateStoreInviteEmailHTML)(data);
            const text = (0, templates_1.generateStoreInviteEmailText)(data);
            const result = await resend.emails.send({
                from: process.env.FROM_EMAIL || 'noreply@25stock.com',
                to: data.email,
                subject: `Convite para loja ${data.storeName} - 25Stock`,
                html,
                text
            });
            console.log('Store invite email sent:', result.data?.id);
            return true;
        }
        catch (error) {
            console.error('Error sending store invite email:', error);
            return false;
        }
    },
    /**
     * Envia email de notificação de estoque baixo
     */
    sendStockLowEmail: async (data) => {
        try {
            const html = (0, templates_1.generateStockLowEmailHTML)(data);
            const text = (0, templates_1.generateStockLowEmailText)(data);
            const result = await resend.emails.send({
                from: process.env.FROM_EMAIL || 'noreply@25stock.com',
                to: data.email,
                subject: `⚠️ ${data.title} - 25Stock`,
                html,
                text
            });
            console.log('Stock low email sent:', result.data?.id);
            return true;
        }
        catch (error) {
            console.error('Error sending stock low email:', error);
            return false;
        }
    },
    /**
     * Envia email de verificação com código de 6 dígitos
     */
    sendEmailVerification: async (data) => {
        try {
            const html = (0, templates_1.generateEmailVerificationHTML)(data);
            const text = (0, templates_1.generateEmailVerificationText)(data);
            const result = await resend.emails.send({
                from: process.env.FROM_EMAIL || 'noreply@25stock.com',
                to: data.email,
                subject: `Confirmação de Email - 25Stock`,
                html,
                text
            });
            console.log('Email verification sent:', result.data?.id);
            return true;
        }
        catch (error) {
            console.error('Error sending email verification:', error);
            return false;
        }
    },
    /**
     * Envia email genérico
     */
    sendEmail: async (template) => {
        try {
            const result = await resend.emails.send({
                from: process.env.FROM_EMAIL || 'noreply@25stock.com',
                to: template.to,
                subject: template.subject,
                html: template.html,
                text: template.text
            });
            console.log('Email sent:', result.data?.id);
            return true;
        }
        catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }
};
