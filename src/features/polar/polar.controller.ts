import { FastifyReply, FastifyRequest } from "fastify";

import { PolarCommands } from "./commands/polar.commands";
import { PolarQueries } from "./queries/polar.queries";
import { CreateCheckoutRequest, ListPolarRequest } from "./polar.interfaces";
import crypto from "crypto";

export const PolarController = {

    async list(request: ListPolarRequest, reply: FastifyReply) {
        try {
            const { page = 1, limit = 10 } = request.query;
            const result = await PolarQueries.list({ page, limit });
            return reply.status(200).send(result);
        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },

    async checkout(request: CreateCheckoutRequest, reply: FastifyReply) {
        try {
            const { productId } = request.body;
            const customer = request.user;
            const result = await PolarCommands.checkout({ productId, customer });

            return reply.status(201).send(result);
        } catch (error: any) {
            request.log.error(error);

            if (error.message === 'Product not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }

            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },

    async webhook(request: FastifyRequest, reply: FastifyReply) {
        try {
            // Verificar assinatura do webhook (HMAC-SHA256)
            const secret = process.env.POLAR_WEBHOOK_SECRET as string | undefined;
            const signatureHeader = (request.headers["polar-signature"] || request.headers["Polar-Signature"]) as string | undefined;
            const rawBody = (request as any).rawBody as string | undefined;

            if (!secret) {
                return reply.status(500).send({ error: "Webhook secret not configured" });
            }
            if (!signatureHeader || !rawBody) {
                return reply.status(400).send({ error: "Missing signature or raw body" });
            }

            const normalize = (sig: string) => sig.startsWith("sha256=") ? sig.slice(7) : sig;
            const received = normalize(signatureHeader);
            const computed = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
            const valid = (() => {
                try {
                    const a = Buffer.from(computed, "hex");
                    const b = Buffer.from(received, "hex");
                    if (a.length !== b.length) return false;
                    return crypto.timingSafeEqual(a, b);
                } catch {
                    return false;
                }
            })();

            if (!valid) {
                return reply.status(400).send({ error: "Invalid signature" });
            }

            const payload = request.body;
            const result = await PolarCommands.webhook(payload);

            if (!result || result.success !== true) {
                return reply.status(400).send({
                    error: result?.error || 'Webhook processing failed'
                });
            }

            return reply.status(200).send({ success: true });
        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
};
