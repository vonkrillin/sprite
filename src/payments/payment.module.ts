import { Module } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { MongooseModule } from "@nestjs/mongoose";
import { PaymentRequest, PaymentRequestSchema } from "../models/payment";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: PaymentRequest.name, schema: PaymentRequestSchema },
        ]),
    ],
    controllers: [],
    providers: [PaymentsService],
    exports: [PaymentsService],
})
export class PaymentModule { }