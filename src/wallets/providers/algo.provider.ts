import { Injectable } from "@nestjs/common";
import { ICryptoWallet, IWalletProvider } from "./wallet-provider.interface";
import algosdk from "algosdk";
import { WalletCurrencyEnum, WalletStatusEnum } from "../../enums";


@Injectable()
export class AlgoWalletProvider implements IWalletProvider {
    private algodClient: algosdk.Algodv2;

    constructor() {
        // remove this hard binding
        this.algodClient = new algosdk.Algodv2(
            'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            'http://localhost',
            '4001'
        );
    }

    async createWalletAddress(): Promise<ICryptoWallet> {
        const account = algosdk.generateAccount();
        const address = account.addr;
        const mnemonic = algosdk.secretKeyToMnemonic(account.sk);
        return {
            publicAddress: address.toString(),
            mnemonic,
            privateKey: Buffer.from(account.sk).toString('hex'),
            status: WalletStatusEnum.ACTIVE,
            currency: WalletCurrencyEnum.ALGO,
        }
    }

    async getBalance(address: string): Promise<number> {
        const accountInfo = await this.algodClient.accountInformation(address).do();
        return Number(accountInfo.amount) / 1e6; // convert microAlgos → Algos
    }
}