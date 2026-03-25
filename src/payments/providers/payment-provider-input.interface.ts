import { WalletCurrencyEnum } from '../../enums';

export interface PaymentItem {
    name: string;
    description: string;
    price: number;
    quantity: number;
    currency: WalletCurrencyEnum;
    metadata?: Record<string, any>;
}

export interface CustomerData {
    email: string;
    name?: string;
    phoneNumber?: string;
}

export interface GeneratePaymentLinkInput {
    amount: number;
    currency: WalletCurrencyEnum;
    paymentReference: string;
    description?: string;
    customer?: CustomerData;
    checkoutItems?: PaymentItem[];
    redirectUrl?: string;
    metadata?: Record<string, any>;
    expiresInMinutes?: number;
}

export interface VerifyPaymentInput {
    paymentReference: string;
    transactionId?: string;
    metadata?: Record<string, any>; // Allow for provider-specific properties
}

import { PaymentStatusEnum } from '../../enums';

export interface GeneratePaymentLinkOutput {
    amount: number;
    currency: WalletCurrencyEnum;
    paymentReference: string;
    paymentUrl?: string;
    status?: PaymentStatusEnum;
    metadata?: Record<string, any>;
}

export interface VerifyPaymentOutput {
    paymentReference: string;
    status: PaymentStatusEnum;
    amountPaid?: number;
    currency?: WalletCurrencyEnum;
    metadata?: Record<string, any>;
}
