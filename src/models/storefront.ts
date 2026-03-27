import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Storefront extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  contactAddress: string;

  @Prop()
  phone: string;

  @Prop()
  about: string;

  @Prop()
  contactEmail: string;

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organization: Types.ObjectId;
}

export const StorefrontSchema = SchemaFactory.createForClass(Storefront);
