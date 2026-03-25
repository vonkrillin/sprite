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
export class Wallet extends Document {
    @Prop({ required: true, type: Types.ObjectId, ref: 'Organization' })
    organization: Types.ObjectId;

    @Prop({ enum: Object.values(WalletCurrencyEnum), required: true })
    currency: WalletCurrencyEnum;

    @Prop({ required: true })
    balance: number;

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


export const WalletSchema = SchemaFactory.createForClass(Wallet);
