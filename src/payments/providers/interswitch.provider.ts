import { Injectable, NotImplementedException } from "@nestjs/common";
import { IPaymentProvider } from "./payment-provider.interface";
import {
    VerifyPaymentInput,
    GeneratePaymentLinkOutput,
    VerifyPaymentOutput
} from "./payment-provider-input.interface";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { WalletCurrencyEnum } from "../../enums";
import { CreatePaymentRequestDto } from "../dtos/create-payment.dto";

@Injectable()
export class InterswitchPaymentProvider implements IPaymentProvider {
    private clientId: string;
    private clientSecret: string;
    private merchantCode: string;
    private payableCode: string;
    private encodedCredentials: string;
    private accessToken: string;
    private tokenExpiry: Date;
    private baseUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.clientId = this.configService.get<string>('INTERSWITCH_CLIENT_ID')!;
        this.clientSecret = this.configService.get<string>('INTERSWITCH_CLIENT_SECRET')!;
        this.merchantCode = this.configService.get<string>('INTERSWITCH_MERCHANT_CODE')!;
        this.payableCode = this.configService.get<string>('INTERSWITCH_PAYABLE_CODE')!;
        this.encodedCredentials = this.encodeCredentials();
        this.baseUrl = this.configService.get<string>('INTERSWITCH_BASE_URL')!;
    }

    private encodeCredentials(): string {
        return Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    }

    private isTokenValid(): boolean {
        return !!(this.accessToken && this.tokenExpiry > new Date());
    }

    private async generateAccessToken(): Promise<void> {
        if (this.isTokenValid()) {
            return;
        }

        const response = await axios.post(`${this.baseUrl}/passport/oauth/token?grant_type=client_credentials`, {
            grant_type: 'client_credentials',
        }, {
            headers: {
                'Authorization': `Basic ${this.encodedCredentials}`,
            },
        });
        this.accessToken = response.data.access_token;
        this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
    }

    async generatePaymentLink(data: CreatePaymentRequestDto): Promise<GeneratePaymentLinkOutput> {
        await this.generateAccessToken();
        const payload = {
            merchantCode: this.merchantCode,
            amount: data.amount!,
            currencyCode: 566, // NGN payments
            payableCode: this.payableCode,
            transactionReference: data.paymentReference,
            customerId: data.customer?.email,
            customerEmail: data.customer?.email,
            redirectUrl: data.redirectUrl,
            metadata: data.metadata,
        } 

        const response = await axios.post(`${this.baseUrl}/paymentgateway/api/v1/paybill`, payload, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
            },
        });

        return {
            amount: data.amount!,
            supportedCurrencies: [WalletCurrencyEnum.NGN],
            paymentReference: response.data.transactionReference,
            paymentUrl: response.data.paymentUrl,
            status: response.data.status,
            metadata: data.metadata,
        }
    }

    async verifyPayment(data: VerifyPaymentInput): Promise<VerifyPaymentOutput> {
        await this.generateAccessToken();
        throw new NotImplementedException("Method not implemented.");
    }
}