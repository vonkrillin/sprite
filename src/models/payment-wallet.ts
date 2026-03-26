import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";
import { WalletCurrencyEnum, WalletProviderEnum, WalletStatusEnum } from "../enums";


@Schema({
    timestamps: true,
    toJSON: {
        transform(doc, ret: any) {
            delete ret.privateKeyEncrypted;
            delete ret.mnemonicEncrypted;
            return ret;
        },
    },
})
export class PaymentWallet extends Document {
    @Prop({ required: true })
    paymentReference: string;

    @Prop({ enum: Object.values(WalletCurrencyEnum), required: true })
    currency: WalletCurrencyEnum;

    @Prop({ required: true, default: 0 })
    balance: number;

    @Prop({ required: true, default: false })
    isLocked: boolean;

    @Prop({ required: true })
    status: WalletStatusEnum;

    @Prop({ enum: Object.values(WalletProviderEnum), required: true })
    provider: WalletProviderEnum;

    @Prop({ required: true })
    address: string;

    @Prop({ required: false })
    privateKeyEncrypted?: string;

    @Prop({ required: false, default: null, type: String })
    mnemonicEncrypted?: string | null;

    @Prop({ required: false, type: MongooseSchema.Types.Mixed })
    metadata?: Record<string, any>;
}


export const PaymentWalletSchema = SchemaFactory.createForClass(PaymentWallet);
