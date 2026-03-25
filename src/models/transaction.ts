import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { TransactionStatusEnum, TransactionTypeEnum } from "../enums";


@Schema({
    timestamps: true,
})
export class Transaction extends Document {
    @Prop({ required: true, type: Types.ObjectId, ref: 'Organization' })
    organization: Types.ObjectId;

    @Prop({ required: true })
    currency: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    type: TransactionTypeEnum;

    @Prop({ required: true })
    status: TransactionStatusEnum;

    @Prop({ required: true })
    reference: string;

    @Prop({ required: true })
    metadata: Record<string, any>;
}