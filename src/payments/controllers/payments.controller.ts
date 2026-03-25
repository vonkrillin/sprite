import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { PaymentsService } from "../payments.service";
import { type CreatePaymentRequestDto, createPaymentRequestSchema } from "../dtos/create-payment.dto";
import { ZodValidationPipe } from "nestjs-zod";

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post()
    @HttpCode(201)
    async createPaymentRequest(@Body(new ZodValidationPipe(createPaymentRequestSchema)) data: CreatePaymentRequestDto) {
        return this.paymentsService.createPaymentRequest(data);
    }
}