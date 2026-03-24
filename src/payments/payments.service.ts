import { Injectable } from "@nestjs/common";
import { CreatePaymentRequestDto } from "./dtos/create-payment.dto";

@Injectable()
export class PaymentsService {
    constructor() { }

    async createPaymentRequest(data: CreatePaymentRequestDto) {
        
    }
}