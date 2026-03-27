import { Injectable, NotImplementedException } from "@nestjs/common";
import { IPaymentProvider } from "./payment-provider.interface";
import { 
    VerifyPaymentInput,
    GeneratePaymentLinkOutput,
    VerifyPaymentOutput,
    PaymentChannelInterface
} from "./payment-provider-input.interface";
import { PaymentCurrencyService } from "../payment-currency.service";
import { ConfigService } from "@nestjs/config";
import { CreatePaymentRequestDto } from "../dtos/create-payment.dto";
import { WalletsService } from "../../wallets/wallets.service";
import { InterswitchPaymentProvider } from "./interswitch.provider";
import { WalletCurrencyEnum, PaymentStatusEnum, WalletProviderEnum, PaymentChannelTypeEnum } from "../../enums";


@Injectable()
export class SpritePaymentProvider implements IPaymentProvider {
    constructor(
        private readonly configService: ConfigService,
        private readonly walletsService: WalletsService,
        private readonly interswitchPaymentProvider: InterswitchPaymentProvider,
        private readonly paymentCurrencyService: PaymentCurrencyService,
    ) {}

    private _supportedCurrencies = [
        WalletCurrencyEnum.NGN,
        WalletCurrencyEnum.USDC,
        WalletCurrencyEnum.ALGO,
        WalletCurrencyEnum.TRX,
    ]

    private generateReference() {
        return `SPRITE-${Date.now()}`;
    }

    async generatePaymentLink(data: CreatePaymentRequestDto): Promise<GeneratePaymentLinkOutput> {
        const feUrl = this.configService.get<string>('SPRITE_PAYMENT_FE_URL');
        if (!feUrl) {
            throw new Error("SPRITE_PAYMENT_FE_URL is not configured.");
        }

        const baseUrl = feUrl.endsWith('/') ? feUrl.slice(0, -1) : feUrl;
        const paymentReference = data.paymentReference || this.generateReference();
        const paymentUrl = `${baseUrl}/payments/${paymentReference}`;

        const paymentChannels: PaymentChannelInterface[] = [];
        const baseCurrency = data.currency;

        const supportedCurrencies = this._supportedCurrencies.filter((currency) => {
            return data.supportedCurrencies.includes(currency);
        });

        // Hard Separation for NGN Channel
        if (supportedCurrencies.includes(WalletCurrencyEnum.NGN)) {
            const interswitchPaymentLink = await this.interswitchPaymentProvider.generatePaymentLink({
                ...data,
                paymentReference,
                amount: data.amount! * 100,
            });
            paymentChannels.push({
                type: PaymentChannelTypeEnum.PAYMENT_LINK,
                currency: WalletCurrencyEnum.NGN,
                link: interswitchPaymentLink.paymentUrl, // Sprite internal hosted checkout page for NGN
                expectedAmount: data.amount!,
            });
        }

        // Mapping for Crypto Channels
        const cryptoMappings = [
            { currency: WalletCurrencyEnum.USDC, provider: WalletProviderEnum.BASE },
            { currency: WalletCurrencyEnum.ALGO, provider: WalletProviderEnum.ALGORAND },
            { currency: WalletCurrencyEnum.TRX, provider: WalletProviderEnum.TRON },
        ];

        // Process Crypto Channels Gracefully
        for (const mapping of cryptoMappings) {
            if (supportedCurrencies.includes(mapping.currency)) {
                try {
                    const expectedAmount = await this.paymentCurrencyService.convertCurrency({
                        fromCurrency: baseCurrency,
                        toCurrency: mapping.currency,
                        amount: data.amount!,
                    });
                    const wallet = await this.walletsService.createPaymentWallet({
                        paymentReference,
                        currency: mapping.currency,
                        provider: mapping.provider,
                        expectedAmount,
                    });

                    paymentChannels.push({
                        type: PaymentChannelTypeEnum.WALLET_ADDRESS,
                        currency: mapping.currency,
                        provider: mapping.provider,
                        address: wallet.address,
                        expectedAmount,
                    });
                } catch (error) {
                    console.error(`Failed to activate ${mapping.currency} channel on ${mapping.provider}`, error);
                    // Continue to next available channel
                }
            }
        }

        return {
            amount: data.amount!,
            supportedCurrencies,
            paymentReference,
            paymentUrl: paymentUrl,
            status: PaymentStatusEnum.PENDING,
            metadata: data.metadata,
            paymentChannels,
        };
    }

    async verifyPayment(data: VerifyPaymentInput): Promise<VerifyPaymentOutput> {
        throw new NotImplementedException("Method not implemented.");
    }
}