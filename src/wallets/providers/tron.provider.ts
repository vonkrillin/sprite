import { Injectable } from "@nestjs/common";
import { ICryptoWallet, IWalletProvider } from "./wallet-provider.interface";
import { TronWeb } from 'tronweb';
import { WalletCurrencyEnum, WalletStatusEnum } from "../../enums";


@Injectable()
export class TronWalletProvider implements IWalletProvider {
    private tronWeb: TronWeb;

    constructor() {
        // remove this hard binding
        // this is a testnet
        this.tronWeb = new TronWeb({
            fullHost: 'https://api.shasta.trongrid.io',
        });
    }

    async createWalletAddress(): Promise<ICryptoWallet> {
        const account = await this.tronWeb.createAccount();
        return {
            mnemonic: null, // todo: implement mnemonic generation
            privateKey: account.privateKey,
            publicAddress: account.publicKey,
            status: WalletStatusEnum.ACTIVE, // tron wallets require transfers to activate
            currency: WalletCurrencyEnum.TRX,
        };
    }

    async getBalance(address: string): Promise<number> {
        const balance = await this.tronWeb.trx.getBalance(address);
        return Number(balance);
    }
}