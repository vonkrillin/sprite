import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum OrganizationTypeEnum {
	BUSINESS = "BUSINESS",
	INDIVIDUAL = "INDIVIDUAL",
	NONPROFIT = "NONPROFIT",
}

export enum OrganizationStatusEnum {
	PENDING = "PENDING",
	ACTIVE = "ACTIVE",
	SUSPENDED = "SUSPENDED",
	DELETED = "DELETED",
}

@Schema({
  timestamps: true,
  toJSON: {
    transform(doc, ret: any) {
      delete ret.password;
      return ret;
    },
  },
})
export class Organization extends Document {
  @Prop({ required: true })
  businessName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    enum: Object.values(OrganizationTypeEnum),
    default: OrganizationTypeEnum.BUSINESS,
  })
  type: OrganizationTypeEnum;

  @Prop({
    enum: Object.values(OrganizationStatusEnum),
    default: OrganizationStatusEnum.PENDING,
  })
  status: OrganizationStatusEnum;

  @Prop({ type: [Types.ObjectId], ref: 'Wallet', default: [] })
  wallets: Types.ObjectId[];

  // Optional owner user reference (if you introduce a User model later)
  // @Prop({ type: Types.ObjectId, ref: "User", required: false })
  // owner?: Types.ObjectId;

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

