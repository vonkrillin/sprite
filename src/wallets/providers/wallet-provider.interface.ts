import { WalletCurrencyEnum, WalletProviderEnum, WalletStatusEnum } from "../../enums";

export interface ICryptoWallet {
    mnemonic: string | null;
    privateKey: string;
    publicAddress: string;
    status: WalletStatusEnum;
    currency: WalletCurrencyEnum;
}

export interface IWalletProvider {
    createWalletAddress(): Promise<ICryptoWallet>;
    getBalance(address: string): Promise<number>;
}

export abstract class AbstractWalletProviderFactory {
    abstract createWalletProvider(walletType: WalletProviderEnum): IWalletProvider;
}