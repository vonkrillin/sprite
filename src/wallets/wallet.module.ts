import { Module } from "@nestjs/common";
import { WalletProviderFactory } from "./providers/wallet.provider";
import { AlgoWalletProvider } from "./providers/algo.provider";
import { TronWalletProvider } from "./providers/tron.provider";

@Module({
    providers: [
        WalletProviderFactory,
        AlgoWalletProvider,
        TronWalletProvider,
    ],
    exports: [
        WalletProviderFactory,
    ],
})
export class WalletModule { }