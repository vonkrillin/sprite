import { WalletCurrencyEnum, PaymentStatusEnum, PaymentChannelTypeEnum, WalletProviderEnum } from '../../enums';

export interface VerifyPaymentInput {
    paymentReference: string;
    transactionId?: string;
    metadata?: Record<string, any>; // Allow for provider-specific properties
}

export interface PaymentChannelInterface {
    type: PaymentChannelTypeEnum;
    currency: WalletCurrencyEnum;
    address?: string;
    link?: string;
    provider?: WalletProviderEnum;
    expectedAmount: number;
}

export interface GeneratePaymentLinkOutput {
    amount: number;
    supportedCurrencies: WalletCurrencyEnum[];
    paymentReference: string;
    paymentUrl?: string;
    status?: PaymentStatusEnum;
    metadata?: Record<string, any>;
    paymentChannels?: PaymentChannelInterface[];
}

export interface VerifyPaymentOutput {
    paymentReference: string;
    status: PaymentStatusEnum;
    amountPaid?: number;
    currency?: WalletCurrencyEnum;
    metadata?: Record<string, any>;
}
