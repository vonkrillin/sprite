import { Injectable } from "@nestjs/common";
import { WalletCurrencyEnum } from "../enums";

/**
 * Simple mock conversion service.
 * In production this would call an external rates API and cache results.
 */
@Injectable()
export class PaymentCurrencyService {
    // Mock rates: from -> to -> rate
    // Using any to avoid strict enum completeness issues during mock implementation
    private readonly rates: any = {
        [WalletCurrencyEnum.NGN]: {
            [WalletCurrencyEnum.NGN]: 1,
            [WalletCurrencyEnum.USDC]: 0.0006666667, // 1 NGN = 0.000666 USDC (1 USDC = 1500 NGN)
            [WalletCurrencyEnum.ALGO]: 0.0012,
            [WalletCurrencyEnum.TRX]: 0.015,
        },
        [WalletCurrencyEnum.USDC]: {
            [WalletCurrencyEnum.NGN]: 1500,
            [WalletCurrencyEnum.USDC]: 1,
            [WalletCurrencyEnum.ALGO]: 1.8,
            [WalletCurrencyEnum.TRX]: 22.5,
        },
        [WalletCurrencyEnum.ALGO]: {
            [WalletCurrencyEnum.NGN]: 833.3333,
            [WalletCurrencyEnum.USDC]: 0.5555556,
            [WalletCurrencyEnum.ALGO]: 1,
            [WalletCurrencyEnum.TRX]: 12.5,
        },
        [WalletCurrencyEnum.TRX]: {
            [WalletCurrencyEnum.NGN]: 66.6667,
            [WalletCurrencyEnum.USDC]: 0.0444444,
            [WalletCurrencyEnum.ALGO]: 0.08,
            [WalletCurrencyEnum.TRX]: 1,
        },
    };

    async convertCurrency(
        data: {
            fromCurrency: WalletCurrencyEnum,
            toCurrency: WalletCurrencyEnum,
            amount: number,
        },
    ): Promise<number> {
        const { fromCurrency, toCurrency, amount } = data;
        if (fromCurrency === toCurrency) {
            return amount;
        }
        const rate = this.rates[fromCurrency][toCurrency];
        if (!rate) {
            throw new Error(`Conversion rate not defined from ${fromCurrency} to ${toCurrency}`);
        }
        const converted = amount * rate;
        // Crypto amounts often need high precision – keep up to 8 decimals
        return Number(converted.toFixed(8));
    }
}