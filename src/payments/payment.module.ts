import { Module } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { MongooseModule } from "@nestjs/mongoose";
import { PaymentRequest, PaymentRequestSchema } from "../models/payment";
import { PaymentsController } from "./controllers/payments.controller";
import { SpritePaymentProvider } from "./providers/sprite.provider";
import { InterswitchPaymentProvider } from "./providers/interswitch.provider";
import { WalletModule } from "../wallets/wallet.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: PaymentRequest.name, schema: PaymentRequestSchema },
        ]),
        WalletModule,
    ],
    controllers: [PaymentsController],
    providers: [PaymentsService, SpritePaymentProvider, InterswitchPaymentProvider],
    exports: [PaymentsService],
})
export class PaymentModule { }