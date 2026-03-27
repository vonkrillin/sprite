import { Module } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { MongooseModule } from "@nestjs/mongoose";
import { PaymentRequest, PaymentRequestSchema } from "../models/payment";
import { Products, ProductSchema } from "../models/products";
import { PaymentsController } from "./controllers/payments.controller";
import { SpritePaymentProvider } from "./providers/sprite.provider";
import { InterswitchPaymentProvider } from "./providers/interswitch.provider";
import { WalletModule } from "../wallets/wallet.module";
import { PaymentCurrencyService } from "./payment-currency.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: PaymentRequest.name, schema: PaymentRequestSchema },
            { name: Products.name, schema: ProductSchema },
        ]),
        WalletModule,
    ],
    controllers: [PaymentsController],
    providers: [
        PaymentsService,
        SpritePaymentProvider,
        InterswitchPaymentProvider,
        PaymentCurrencyService,
    ],
    exports: [PaymentsService],
})
export class PaymentModule { }