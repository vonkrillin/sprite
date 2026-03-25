import { Injectable, NotImplementedException } from "@nestjs/common";
import { IPaymentProvider } from "./payment-provider.interface";
import { 
    GeneratePaymentLinkInput, 
    VerifyPaymentInput,
    GeneratePaymentLinkOutput,
    VerifyPaymentOutput
} from "./payment-provider-input.interface";

@Injectable()
export class SpritePaymentProvider implements IPaymentProvider {
    constructor() {}

    async generatePaymentLink(data: GeneratePaymentLinkInput): Promise<GeneratePaymentLinkOutput> {
        throw new NotImplementedException("Method not implemented.");
    }

    async verifyPayment(data: VerifyPaymentInput): Promise<VerifyPaymentOutput> {
        throw new NotImplementedException("Method not implemented.");
    }
}