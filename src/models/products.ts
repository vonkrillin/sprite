import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Products extends Document {
  @Prop({ required: true })
  productName: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'ProductCategory', default: [] })
  category: Types.ObjectId;

  @Prop({ required: true })
  currency: string;

  @Prop()
  images: string[];

  @Prop({ required: true })
  quantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Products);

@Schema({
  timestamps: true,
})
export class ProductCategory extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;
}

export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);
