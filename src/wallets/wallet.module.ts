import { Module } from "@nestjs/common";
import { WalletProviderFactory } from "./providers/wallet.provider";
import { AlgoWalletProvider } from "./providers/algo.provider";
import { TronWalletProvider } from "./providers/tron.provider";
import { WalletEncryptionService } from "./encryption/wallet-encryption.service";
import { WalletsController } from "./wallets.controller";
import { WalletsService } from "./wallets.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Wallet, WalletSchema } from "../models/wallet";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Wallet.name, schema: WalletSchema },
        ]),
    ],
    providers: [
        WalletProviderFactory,
        AlgoWalletProvider,
        TronWalletProvider,
        WalletEncryptionService,
        WalletsService,
    ],
    exports: [
        WalletProviderFactory,
        WalletEncryptionService,
    ],
    controllers: [
        WalletsController,
    ],
})
export class WalletModule { }