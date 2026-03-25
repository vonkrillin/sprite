import { 
    GeneratePaymentLinkInput, 
    VerifyPaymentInput,
    GeneratePaymentLinkOutput,
    VerifyPaymentOutput 
} from './payment-provider-input.interface';

export interface IPaymentProvider {
   generatePaymentLink(data: GeneratePaymentLinkInput): Promise<GeneratePaymentLinkOutput>;   
   verifyPayment(data: VerifyPaymentInput): Promise<VerifyPaymentOutput>;
}