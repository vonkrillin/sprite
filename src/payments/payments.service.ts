import { Injectable } from "@nestjs/common";
import { type CreatePaymentRequestDto } from "./dtos/create-payment.dto";
import { SpritePaymentProvider } from "./providers/sprite.provider";
import { Model, Types } from "mongoose";
import { PaymentRequest } from "../models/payment";
import { InjectModel } from "@nestjs/mongoose";
import { PaymentProviderEnum, PaymentStatusEnum } from "../enums";
import { InterswitchPaymentProvider } from "./providers/interswitch.provider";

@Injectable()
export class PaymentsService {
    constructor(
        private readonly spritePaymentProvider: SpritePaymentProvider,
        private readonly interswitchPaymentProvider: InterswitchPaymentProvider,
        @InjectModel(PaymentRequest.name) private readonly paymentRequestModel: Model<PaymentRequest>,
    ) { }

    private _DEFAULT_PAYMENT_LIFETIME_MINUTES = 720;

    generatePaymentReference() {
        return `SPRITE-${Date.now()}`;
    }

    async createPaymentRequest(data: CreatePaymentRequestDto & { organization: Types.ObjectId }) {
        const paymentReference = data.paymentReference || this.generatePaymentReference();
        const paymentRequestLifeTime = data.expiresInMinutes || this._DEFAULT_PAYMENT_LIFETIME_MINUTES;
        const paymentRequest = await this.paymentRequestModel.create({
            ...data,
            paymentReference,
            status: PaymentStatusEnum.PENDING,
            expiresAt: new Date(Date.now() + paymentRequestLifeTime * 60 * 1000),
        });

        const paymentLink = await this.spritePaymentProvider.generatePaymentLink({
            ...data,
            paymentReference,
        });

        const providerPaymentUrls: Record<PaymentProviderEnum, string | undefined> = {
            [PaymentProviderEnum.SPRITE]: paymentLink.paymentUrl,
            [PaymentProviderEnum.INTERSWITCH]: (await this.interswitchPaymentProvider.generatePaymentLink({
                ...data,
                paymentReference,
                amount: data.amount * 100,
            })).paymentUrl,
            [PaymentProviderEnum.BASE]: undefined,
        };

        await this.paymentRequestModel.updateOne({
            _id: paymentRequest._id,
        }, {
            paymentUrl: paymentLink.paymentUrl,
            providerPaymentUrls,
        });

        return {
            paymentRequest: paymentRequest.toObject(),
            paymentLink,
        };
    }
}