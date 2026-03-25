import { Injectable } from "@nestjs/common";
import { type CreatePaymentRequestDto } from "./dtos/create-payment.dto";

@Injectable()
export class PaymentsService {
    constructor() { }

    async createPaymentRequest(data: CreatePaymentRequestDto) {
        
    }
}