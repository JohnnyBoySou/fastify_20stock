import { db } from '@/plugins/prisma';
import { polar } from '@/plugins/polar';
import { AuthUser } from '@/features/auth/auth.interfaces';

export const PolarCommands = {
    async checkout(data: {
        productId: string
        customer: AuthUser
    }) {
        try {
            const checkout = await polar.checkouts.create({
                customerBillingAddress: {
                    country: "BR",
                },
                customerEmail: data.customer.email,
                customerName: data.customer.name,
                products: [data.productId]
            });
            if (!checkout) {
                throw new Error('Failed to create checkout');
            }
            return checkout;
        }
        catch (error) {
            console.error('Polar checkout error:', error);
            throw new Error('Failed to create checkout');
        }
    },

    async webhook(event: any) {
        try {
            // Tipos possíveis relevantes para este projeto:
            // - 'order.created' | 'order.updated' | 'order.paid' | 'order.refunded'
            // - 'customer.state_changed' (ver docs Polar)
            // - eventos anteriores mantidos para compat

            const type: string = event?.type || '';
            const data = event?.data || {};

            // Helpers
            const findOrCreateCustomerByUserId = async (userId: string) => {
                let customer = await db.customer.findFirst({ where: { userId } });
                if (!customer) {
                    customer = await db.customer.create({ data: { userId, status: 'ACTIVE' } as any });
                }
                return customer;
            };

            const findCustomerByPolarOrEmail = async (opts: { polarCustomerId?: string | null, email?: string | null }) => {
                const { polarCustomerId, email } = opts;
                if (polarCustomerId) {
                    const byPolar = await db.customer.findFirst({ where: { polarCustomerId } });
                    if (byPolar) return byPolar;
                }
                if (email) {
                    const user = await db.user.findFirst({ where: { email } });
                    if (user) return await findOrCreateCustomerByUserId(user.id);
                }
                return null;
            };

            const resolvePlanByPolarProduct = async (polarProductId?: string | null) => {
                if (!polarProductId) return null;
                return await db.plan.findFirst({ where: { polarProductId } });
            };

            const setCustomerPlanAndStatus = async (customerId: string, planId: string | null, status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'TRIAL', renewalDate?: Date | null, trialEndsAt?: Date | null) => {
                return await db.customer.update({
                    where: { id: customerId },
                    data: {
                        planId: planId || undefined,
                        status,
                        renewalDate: renewalDate || null,
                        trialEndsAt: trialEndsAt || null,
                    }
                });
            };

            const upsertInvoice = async (customerId: string, amountCents?: number | null, polarInvoiceId?: string | null, status: 'PENDING' | 'PAID' | 'FAILED' = 'PENDING', paymentDate?: Date | null) => {
                if (!amountCents && !polarInvoiceId) return null;
                const amount = amountCents ? (Number(amountCents) / 100).toFixed(2) : '0.00';
                const existing = polarInvoiceId ? await db.invoice.findFirst({ where: { polarInvoiceId } }) : null;
                if (existing) {
                    return await db.invoice.update({
                        where: { id: existing.id },
                        data: {
                            status,
                            paymentDate: paymentDate || existing.paymentDate || null
                        }
                    });
                }
                return await db.invoice.create({
                    data: {
                        customerId,
                        amount: amount as any,
                        status,
                        polarInvoiceId: polarInvoiceId || null,
                        paymentDate: paymentDate || null
                    }
                });
            };

            // Compat: eventos antigos do handler anterior
            const checkout = data?.checkout_session;
            const subscription = data?.subscription;

            switch (type) {
                case 'checkout.succeeded': {
                    const userIdFromMetadata = checkout?.metadata?.user_id as string | undefined;
                    const polarCustomerId = checkout?.customer_id as string | undefined;
                    const polarSubscriptionId = checkout?.subscription_id as string | undefined;

                    if (userIdFromMetadata) {
                        const customer = await findOrCreateCustomerByUserId(userIdFromMetadata);
                        await db.customer.update({
                            where: { id: customer.id },
                            data: {
                                polarCustomerId: polarCustomerId || customer.polarCustomerId || null,
                                polarSubscriptionId: polarSubscriptionId || customer.polarSubscriptionId || null
                            }
                        });
                    } else if (polarCustomerId) {
                        const customer = await findCustomerByPolarOrEmail({ polarCustomerId, email: null });
                        if (customer) {
                            await db.customer.update({
                                where: { id: customer.id },
                                data: { polarCustomerId, polarSubscriptionId: polarSubscriptionId || customer.polarSubscriptionId || null }
                            });
                        }
                    }
                    break;
                }

                case 'subscription.created':
                case 'subscription.updated':
                case 'subscription.canceled': {
                    const polarCustomerId = subscription?.customer_id as string | undefined;
                    const polarSubscriptionId = subscription?.id as string | undefined;
                    if (polarCustomerId || polarSubscriptionId) {
                        const customer = await findCustomerByPolarOrEmail({ polarCustomerId, email: null });
                        if (customer) {
                            await db.customer.update({
                                where: { id: customer.id },
                                data: {
                                    polarCustomerId: polarCustomerId || customer.polarCustomerId || null,
                                    polarSubscriptionId: polarSubscriptionId || customer.polarSubscriptionId || null
                                }
                            });
                        }
                    }
                    break;
                }

                // === NOVOS EVENTOS DE ORDER ===
                case 'order.created':
                case 'order.updated': {
                    // Mantemos referência a customer/product, mas não mudamos status/plano até pagamento
                    const order = data;
                    const polarCustomerId: string | undefined = order?.customer_id || order?.customerId;
                    const email: string | undefined = order?.customer?.email || order?.email;
                    const productId: string | undefined = order?.product_id || order?.productId;

                    const customer = await findCustomerByPolarOrEmail({ polarCustomerId, email });
                    if (customer) {
                        // Vincular ids Polar conhecidos
                        await db.customer.update({
                            where: { id: customer.id },
                            data: {
                                polarCustomerId: polarCustomerId || customer.polarCustomerId || null
                            }
                        });

                        // Opcional: pré-vincular plano se existir correspondência
                        const plan = await resolvePlanByPolarProduct(productId);
                        if (plan && customer.planId !== plan.id) {
                            await db.customer.update({ where: { id: customer.id }, data: { planId: plan.id } });
                        }
                    }
                    break;
                }

                case 'order.paid': {
                    const order = data;
                    const polarCustomerId: string | undefined = order?.customer_id || order?.customerId;
                    const email: string | undefined = order?.customer?.email || order?.email;
                    const productId: string | undefined = order?.product_id || order?.productId;
                    const amountCents: number | undefined = order?.amount || order?.amount_cents || order?.total_amount_cents;
                    const invoiceId: string | undefined = order?.invoice_id || order?.invoiceId;
                    const currentPeriodEndIso: string | undefined = order?.current_period_end;

                    const customer = await findCustomerByPolarOrEmail({ polarCustomerId, email });
                    if (!customer) break;

                    const plan = await resolvePlanByPolarProduct(productId);
                    const renewalDate = currentPeriodEndIso ? new Date(currentPeriodEndIso) : null;
                    await setCustomerPlanAndStatus(customer.id, plan ? plan.id : null, 'ACTIVE', renewalDate, null);
                    await upsertInvoice(customer.id, amountCents, invoiceId || null, 'PAID', new Date());
                    break;
                }

                case 'order.refunded': {
                    const order = data;
                    const polarCustomerId: string | undefined = order?.customer_id || order?.customerId;
                    const email: string | undefined = order?.customer?.email || order?.email;
                    const invoiceId: string | undefined = order?.invoice_id || order?.invoiceId;

                    const customer = await findCustomerByPolarOrEmail({ polarCustomerId, email });
                    if (!customer) break;
                    await setCustomerPlanAndStatus(customer.id, customer.planId, 'INACTIVE', null, null);
                    await upsertInvoice(customer.id, null, invoiceId || null, 'FAILED', null);
                    break;
                }

                case 'customer.state_changed': {
                    // Docs: https://polar.sh/docs/api-reference/webhooks/customer.state_changed
                    // data.email, data.active_subscriptions[], each has product_id, status, current_period_end, trial_* etc
                    const email: string | undefined = data?.email;
                    const polarCustomerId: string | undefined = data?.id;
                    const activeSub = Array.isArray(data?.active_subscriptions) && data.active_subscriptions.length > 0
                        ? data.active_subscriptions[0]
                        : null;

                    const customer = await findCustomerByPolarOrEmail({ polarCustomerId, email });
                    if (!customer) break;

                    const productId: string | undefined = activeSub?.product_id;
                    const plan = await resolvePlanByPolarProduct(productId);
                    const statusMap: Record<string, 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'TRIAL'> = {
                        active: 'ACTIVE',
                        trialing: 'TRIAL',
                        canceled: 'CANCELLED',
                        paused: 'INACTIVE',
                        past_due: 'INACTIVE'
                    } as const;

                    const subStatus: string | undefined = activeSub?.status;
                    const mappedStatus = (subStatus && statusMap[subStatus]) ? statusMap[subStatus] : 'ACTIVE';
                    const renewalDate = activeSub?.current_period_end ? new Date(activeSub.current_period_end) : null;
                    const trialEndsAt = activeSub?.trial_end ? new Date(activeSub.trial_end) : null;

                    await db.customer.update({
                        where: { id: customer.id },
                        data: {
                            polarCustomerId: polarCustomerId || customer.polarCustomerId || null,
                            polarSubscriptionId: activeSub?.id || customer.polarSubscriptionId || null,
                        }
                    });

                    await setCustomerPlanAndStatus(customer.id, plan ? plan.id : null, mappedStatus, renewalDate, trialEndsAt);
                    break;
                }

                default:
                    break;
            }

            return { success: true };
        } catch (error: any) {
            // Logar erro no console por ser camada de commands
            console.error('Polar webhook error:', error);
            return { success: false, error: error?.message || 'Internal error' };
        }
    }
}