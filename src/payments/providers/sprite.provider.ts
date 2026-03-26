import { Injectable, NotImplementedException } from "@nestjs/common";
import { IPaymentProvider } from "./payment-provider.interface";
import { 
    VerifyPaymentInput,
    GeneratePaymentLinkOutput,
    VerifyPaymentOutput
} from "./payment-provider-input.interface";
import { WalletCurrencyEnum, PaymentStatusEnum } from "../../enums";
import { ConfigService } from "@nestjs/config";
import { CreatePaymentRequestDto } from "../dtos/create-payment.dto";

@Injectable()
export class SpritePaymentProvider implements IPaymentProvider {
    constructor(private readonly configService: ConfigService) {}

    private _supportedCurrencies = [
        WalletCurrencyEnum.NGN,
        WalletCurrencyEnum.USDC,
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
        const paymentUrl = `${baseUrl}/payments/${data.paymentReference}`;

        return {
            amount: data.amount,
            supportedCurrencies: this._supportedCurrencies,
            paymentReference: data.paymentReference || this.generateReference(),
            paymentUrl: paymentUrl,
            status: PaymentStatusEnum.PENDING,
            metadata: data.metadata,
        };
    }

    async verifyPayment(data: VerifyPaymentInput): Promise<VerifyPaymentOutput> {
        throw new NotImplementedException("Method not implemented.");
    }
}