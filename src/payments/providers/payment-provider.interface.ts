import {  
    VerifyPaymentInput,
    GeneratePaymentLinkOutput,
    VerifyPaymentOutput 
} from './payment-provider-input.interface';
import { CreatePaymentRequestDto } from '../dtos/create-payment.dto';

export interface IPaymentProvider {
   generatePaymentLink(data: CreatePaymentRequestDto): Promise<GeneratePaymentLinkOutput>;   
   verifyPayment(data: VerifyPaymentInput): Promise<VerifyPaymentOutput>;
}