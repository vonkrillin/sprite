import { z } from "zod";
import { PaymentProviderEnum, WalletCurrencyEnum } from "../../enums";

export const checkoutDataSchema = z.object({
    productId: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    quantity: z.number(),
    currency: z.enum(Object.values(WalletCurrencyEnum)).optional(),
    metadata: z.record(z.string(), z.any()).optional(),
})

export const createPaymentRequestSchema = z.object({
    amount: z.number().optional(),
    description: z.string(),
    allowedPaymentProviders: z.array(z.enum(Object.values(PaymentProviderEnum)))
        .default([PaymentProviderEnum.INTERSWITCH]),
    currency: z.enum(Object.values(WalletCurrencyEnum)).default(WalletCurrencyEnum.NGN),
    supportedCurrencies: z.array(z.enum(Object.values(WalletCurrencyEnum)))
        .default([WalletCurrencyEnum.NGN]),
    expiresInMinutes: z.number().min(1).max(1440).default(720).optional(),
    checkoutData: z.array(checkoutDataSchema).min(1),
    paymentReference: z.string().optional(),
    customer: z.object({
        email: z.email(),
        name: z.string().optional(),
        phoneNumber: z.string().optional(),
    }),
    checkoutItems: z.array(checkoutDataSchema).default([]),
    redirectUrl: z.string().optional(),
    metadata: z.record(z.string(), z.any()).optional(),
});

export type CreatePaymentRequestDto = z.infer<typeof createPaymentRequestSchema>;