import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";
import { WalletCurrencyEnum, PaymentStatusEnum, PaymentProviderEnum, PaymentChannelTypeEnum, WalletProviderEnum } from "../enums";


@Schema()
export class IPaymentRequestCheckoutData {
    @Prop({ required: false, default: null, type: String })
    image: string | null;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: false, type: MongooseSchema.Types.Mixed })
    metadata?: Record<string, any>;
}


@Schema()
export class PaymentChannel {
    @Prop({ required: true, enum: Object.values(PaymentChannelTypeEnum) })
    type: PaymentChannelTypeEnum;

    @Prop({ required: true, enum: Object.values(WalletCurrencyEnum) })
    currency: WalletCurrencyEnum;

    @Prop({ required: false })
    address?: string;

    @Prop({ required: false })
    link?: string;

    @Prop({ required: false, enum: Object.values(WalletProviderEnum) })
    provider?: WalletProviderEnum;
}


@Schema()
export class PaymentRequestCustomer {
    @Prop({ required: false })
    customerId?: string;

    @Prop({ required: false })
    name?: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: false })
    phone?: string;
}


@Schema({ timestamps: true })
export class PaymentRequest extends Document {
    @Prop({ required: true, type: Types.ObjectId, ref: 'Organization' })
    organization: Types.ObjectId;

    @Prop({ required: true })
    paymentReference: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, enum: Object.values(WalletCurrencyEnum), type: Array<WalletCurrencyEnum> })
    supportedCurrencies: WalletCurrencyEnum[];

    @Prop({ required: false, type: Types.ObjectId, ref: 'Wallet' })
    receiverWallet?: Types.ObjectId;

    @Prop({ required: false })
    senderWalletAddress?: string;

    @Prop({ required: false })
    receiverWalletAddress?: string;

    @Prop({ required: false })
    transactionId?: string;

    @Prop({ required: false, type: MongooseSchema.Types.Mixed })
    metadata?: Record<string, any>;

    @Prop({ required: true, enum: Object.values(PaymentStatusEnum), default: PaymentStatusEnum.PENDING })
    status: PaymentStatusEnum;

    @Prop({ required: false, type: Array<IPaymentRequestCheckoutData> })
    checkoutData?: IPaymentRequestCheckoutData[];

    @Prop({ required: true, enum: Object.values(PaymentProviderEnum), type: Array<PaymentProviderEnum> })
    allowedPaymentProviders: PaymentProviderEnum[];

    @Prop({ required: true, type: PaymentRequestCustomer })
    customer: PaymentRequestCustomer;

    @Prop({ required: true })
    expiresAt: Date;

    @Prop({ required: false })
    paymentUrl?: string;

    @Prop({ required: false, type: MongooseSchema.Types.Mixed })
    providerPaymentUrls?: Record<PaymentProviderEnum, string>;

    @Prop({ required: false, type: Array<PaymentChannel> })
    paymentChannels?: PaymentChannel[];
}

export const PaymentRequestSchema = SchemaFactory.createForClass(PaymentRequest);
