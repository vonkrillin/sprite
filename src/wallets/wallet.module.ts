import { Module } from "@nestjs/common";
import { WalletProviderFactory } from "./providers/wallet.provider";
import { AlgoWalletProvider } from "./providers/algo.provider";
import { TronWalletProvider } from "./providers/tron.provider";
import { WalletEncryptionService } from "./encryption/wallet-encryption.service";
import { WalletsController } from "./controllers/wallets.controller";
import { WalletsService } from "./wallets.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Wallet, WalletSchema } from "../models/wallet";
import { PaymentWallet, PaymentWalletSchema } from "../models/payment-wallet";
import { WalletsDashboardController } from "./controllers/wallets-dashboard.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Wallet.name, schema: WalletSchema },
            { name: PaymentWallet.name, schema: PaymentWalletSchema },
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
        WalletsService,
    ],
    controllers: [
        WalletsController,
        WalletsDashboardController,
    ],
})
export class WalletModule { }