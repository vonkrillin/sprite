import { BadRequestException, Injectable } from "@nestjs/common";
import { type CreatePaymentRequestDto } from "./dtos/create-payment.dto";
import { SpritePaymentProvider } from "./providers/sprite.provider";
import { Model, Types } from "mongoose";
import { PaymentRequest } from "../models/payment";
import { InjectModel } from "@nestjs/mongoose";
import { PaymentStatusEnum, WalletCurrencyEnum } from "../enums";
import { Products } from "../models/products";

@Injectable()
export class PaymentsService {
    constructor(
        private readonly spritePaymentProvider: SpritePaymentProvider,
        @InjectModel(PaymentRequest.name) private readonly paymentRequestModel: Model<PaymentRequest>,
        @InjectModel(Products.name) private readonly productsModel: Model<Products>,
    ) { }

    private _DEFAULT_PAYMENT_LIFETIME_MINUTES = 720;

    generatePaymentReference() {
        return `SPRITE-${Date.now()}`;
    }

    async createPaymentRequest(data: CreatePaymentRequestDto & { organization: Types.ObjectId }) {
        let { amount, currency, checkoutData } = data;

        // 1. Fetch products and calculate amount if productIds are provided
        const productIds = checkoutData
            ? checkoutData.map((item) => item.productId).filter((id): id is string => !!id)
            : [];

        if(!productIds.length) {
            throw new BadRequestException('No products found');
        }

        if (productIds.length > 0) {
            const products = await this.productsModel.find({
                _id: { $in: productIds.map((id) => new Types.ObjectId(id)) },
            });

            if(!products.length) {
                throw new BadRequestException('No products found');
            }

            let calculatedAmount = 0;
            const enrichedCheckoutData = checkoutData!.filter(
                (item) => !!item.productId
            ).map((item) => {
                const product = products.find((p) => p._id.toString() === item.productId);
                if (!product) return item;

                calculatedAmount += (product.price || 0) * (item.quantity || 0);
                return {
                    ...item,
                    name: product.productName,
                    description: product.description,
                    price: product.price,
                    currency: product.currency,
                };
            });

            amount = calculatedAmount || amount;
            currency = products[0]?.currency || currency || WalletCurrencyEnum.NGN;
            checkoutData = enrichedCheckoutData;
        }

        const paymentReference = data.paymentReference || this.generatePaymentReference();
        const paymentRequestLifeTime = data.expiresInMinutes || this._DEFAULT_PAYMENT_LIFETIME_MINUTES;
        const paymentRequest = await this.paymentRequestModel.create({
            ...data,
            amount: amount!,
            // currency: currency!,
            checkoutData,
            paymentReference,
            status: PaymentStatusEnum.PENDING,
            expiresAt: new Date(Date.now() + paymentRequestLifeTime * 60 * 1000),
        });

        const paymentLink = await this.spritePaymentProvider.generatePaymentLink({
            ...data,
            amount,
            currency,
            checkoutData,
            paymentReference,
        });

        const updatedPayment = await this.paymentRequestModel.findByIdAndUpdate({
            _id: paymentRequest._id,
        }, {
            paymentUrl: paymentLink.paymentUrl,
            paymentChannels: paymentLink.paymentChannels,
        }, { returnDocument: 'after' });

        return {
            paymentRequest: updatedPayment,
            paymentUrl: paymentLink.paymentUrl,
        };
    }
}