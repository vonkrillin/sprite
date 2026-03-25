import { z } from "zod";
import { PaymentProviderEnum, WalletCurrencyEnum } from "../../enums";

export const checkoutDataSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    quantity: z.number(),
    currency: z.enum(Object.values(WalletCurrencyEnum)),
    metadata: z.record(z.string(), z.any()).optional(),
})

export const createPaymentRequestSchema = z.object({
    amount: z.number(),
    description: z.string(),
    allowedPaymentProviders: z.array(z.enum(Object.values(PaymentProviderEnum))),
    currency: z.enum(Object.values(WalletCurrencyEnum)),
    expiresInMinutes: z.number().min(1).max(1440).optional(),
    checkoutData: z.array(checkoutDataSchema).optional(),
    paymentReference: z.string().optional(),
});

export type CreatePaymentRequestDto = z.infer<typeof createPaymentRequestSchema>;