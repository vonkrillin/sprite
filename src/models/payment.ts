import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { WalletCurrencyEnum, PaymentStatusEnum } from "../enums";


@Schema()
export class IPaymentRequestCheckoutData {
    @Prop({ required: false, default: null })
    image: string | null;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true, enum: Object.values(WalletCurrencyEnum) })
    currency: WalletCurrencyEnum;
}


@Schema({ timestamps: true })
export class PaymentRequest extends Document {
    @Prop({ required: true, type: Types.ObjectId, ref: 'Organization' })
    organization: Types.ObjectId;

    @Prop({ required: true })
    paymentReference: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, enum: Object.values(WalletCurrencyEnum) })
    currency: WalletCurrencyEnum;

    @Prop({ required: true, type: Types.ObjectId, ref: 'Wallet' })
    receiverWallet: Types.ObjectId;

    @Prop({ required: false })
    senderWalletAddress?: string;

    @Prop({ required: false })
    receiverWalletAddress?: string;

    @Prop({ required: false })
    transactionId?: string;

    @Prop({ required: false })
    metadata?: Record<string, any>;

    @Prop({ required: true, enum: Object.values(PaymentStatusEnum), default: PaymentStatusEnum.PENDING })
    status: PaymentStatusEnum;

    @Prop({ required: false, type: Array<IPaymentRequestCheckoutData> })
    checkoutData?: IPaymentRequestCheckoutData[];

    @Prop({ required: true })
    expiresAt: Date;
}

export const PaymentRequestSchema = SchemaFactory.createForClass(PaymentRequest);
