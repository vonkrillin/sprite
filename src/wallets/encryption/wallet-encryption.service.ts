import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class WalletEncryptionService {
    constructor(private readonly configService: ConfigService) { }

    async encrypt(data: string): Promise<string> {
        return data;
    }

    async decrypt(data: string): Promise<string> {
        return data;
    }
}