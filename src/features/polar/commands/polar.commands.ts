import { db } from '@/plugins/prisma';

export const PolarCommands = {
    async checkout(data: {
        productId: string
        userId: string
    }) {
        const accessToken = process.env.POLAR_ACCESS_TOKEN as string;
        const baseUrl = process.env.POLAR_BASE_URL || 'https://api.polar.sh';
        const successUrl = process.env.POLAR_SUCCESS_URL || `${process.env.APP_URL || 'http://localhost:3000'}/payment/success`;
        const cancelUrl = process.env.POLAR_CANCEL_URL || `${process.env.APP_URL || 'http://localhost:3000'}/payment/cancel`;

        const response = await fetch(`${baseUrl}/v1/checkout/sessions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                product_id: data.productId,
                success_url: successUrl,
                cancel_url: cancelUrl,
                metadata: {
                    user_id: data.userId
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.message || `Failed to create checkout: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    },

    async webhook(event: any) {
        try {
            // Estrutura esperada baseada em PolarService/Polar types
            // event.type: 'checkout.succeeded' | 'checkout.expired' | 'subscription.created' | 'subscription.updated' | 'subscription.canceled' | ...
            // event.data: { checkout_session?, subscription? }

            const type: string = event?.type || '';
            const checkout = event?.data?.checkout_session;
            const subscription = event?.data?.subscription;

            // Helpers
            const setCustomerPolarFields = async (where: any, data: any) => {
                const existing = await db.customer.findFirst({ where });
                if (existing) {
                    return db.customer.update({ where: { id: existing.id }, data });
                }
                // Não temos userId diretamente? Tentar criar se vier via metadata.user_id
                if (where.userId) {
                    return db.customer.create({ data: { userId: where.userId, ...data } });
                }
                return existing; // nada a fazer
            };

            switch (type) {
                case 'checkout.succeeded': {
                    const userIdFromMetadata = checkout?.metadata?.user_id as string | undefined;
                    const polarCustomerId = checkout?.customer_id as string | undefined;
                    const polarSubscriptionId = checkout?.subscription_id as string | undefined;

                    // Prioridade 1: metadata.user_id
                    if (userIdFromMetadata) {
                        await setCustomerPolarFields(
                            { userId: userIdFromMetadata },
                            {
                                polarCustomerId: polarCustomerId || undefined,
                                polarSubscriptionId: polarSubscriptionId || undefined
                            }
                        );
                    } else if (polarCustomerId) {
                        // Prioridade 2: localizar por polarCustomerId
                        await setCustomerPolarFields(
                            { polarCustomerId },
                            {
                                polarCustomerId,
                                polarSubscriptionId: polarSubscriptionId || undefined
                            }
                        );
                    }
                    break;
                }

                case 'subscription.created':
                case 'subscription.updated':
                case 'subscription.canceled': {
                    const polarCustomerId = subscription?.customer_id as string | undefined;
                    const polarSubscriptionId = subscription?.id as string | undefined;

                    if (polarCustomerId || polarSubscriptionId) {
                        await setCustomerPolarFields(
                            polarCustomerId ? { polarCustomerId } : { polarSubscriptionId },
                            {
                                polarCustomerId: polarCustomerId || undefined,
                                polarSubscriptionId: polarSubscriptionId || undefined
                            }
                        );
                    }
                    break;
                }

                default:
                    // Outros eventos ignorados por enquanto
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