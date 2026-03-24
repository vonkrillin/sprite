import { Injectable, NotImplementedException } from "@nestjs/common";
import { AbstractWalletProviderFactory, IWalletProvider } from "./wallet-provider.interface";
import { WalletProviderEnum } from "../../enums";
import { AlgoWalletProvider } from "./algo.provider";
import { TronWalletProvider } from "./tron.provider";


@Injectable()
export class WalletProviderFactory extends AbstractWalletProviderFactory {
    constructor(
        private readonly algoWalletProvider: AlgoWalletProvider,
        private readonly tronWalletProvider: TronWalletProvider,
    ) {
        super();
    }

    createWalletProvider(walletType: WalletProviderEnum): IWalletProvider {
        switch (walletType) {
            case WalletProviderEnum.ALGORAND:
                return this.algoWalletProvider;
            case WalletProviderEnum.TRON:
                return this.tronWalletProvider;
            default:
                throw new NotImplementedException(`Unsupported wallet type: ${walletType}`);
        }
    }
}