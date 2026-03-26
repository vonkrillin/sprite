import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { PaymentsService } from "../payments.service";
import { type CreatePaymentRequestDto, createPaymentRequestSchema } from "../dtos/create-payment.dto";
import { ZodValidationPipe } from "nestjs-zod";
import { JWTAuthGuard } from "../../auth/auth.guard";
import { Types } from "mongoose";

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post()
    @UseGuards(JWTAuthGuard)
    @HttpCode(201)
    async createPaymentRequest(
        @Req() req: any,
        @Body(new ZodValidationPipe(createPaymentRequestSchema)) data: CreatePaymentRequestDto) {
        return this.paymentsService.createPaymentRequest({
            ...data, organization: new Types.ObjectId(req.organization._id) 
        });
    }
}