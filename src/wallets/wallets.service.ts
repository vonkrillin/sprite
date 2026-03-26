import { BadRequestException, Injectable, NotFoundException, NotImplementedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Wallet } from "../models/wallet";
import { PaymentWallet } from "../models/payment-wallet";
import { Model, Types } from "mongoose";
import { WalletProviderFactory } from "./providers/wallet.provider";
import { WalletProviderEnum, WalletStatusEnum, WalletCurrencyEnum } from "../enums";
import { WalletEncryptionService } from "./encryption/wallet-encryption.service";


@Injectable()
export class WalletsService {
    constructor(
        // todo: replace with repository pattern
        @InjectModel(Wallet.name) private readonly walletModel: Model<Wallet>,
        @InjectModel(PaymentWallet.name) private readonly paymentWalletModel: Model<PaymentWallet>,
        private readonly walletProviderFactory: WalletProviderFactory,
        private readonly walletEncryptionService: WalletEncryptionService,
    ) { }

    private async getWalletProvider(provider: WalletProviderEnum) {
        return this.walletProviderFactory.createWalletProvider(provider);
    }

    async createWallet(data: { organizationId: string, provider: WalletProviderEnum }) {
        const organizationId = new Types.ObjectId(data.organizationId);
        const walletProvider = await this.getWalletProvider(data.provider);
        const existingWallet = await this.getWallet({
            organizationId: data.organizationId,
            provider: data.provider,
        });

        if (existingWallet) {
            throw new BadRequestException(`An existing ${data.provider} wallet was found for this organization`);
        }

        const cryptoWallet = await walletProvider.createWalletAddress();
        
        return await this.walletModel.create({
            organization: organizationId,
            currency: cryptoWallet.currency,
            provider: data.provider,
            status: cryptoWallet.status,
            balance: 0,
            address: cryptoWallet.publicAddress,
            privateKeyEncrypted: await this.walletEncryptionService.encrypt(cryptoWallet.privateKey),
            mnemonicEncrypted: cryptoWallet.mnemonic ? await this.walletEncryptionService.encrypt(cryptoWallet.mnemonic) : null,
        });
    }

    async createPaymentWallet(data: { paymentReference: string, currency: WalletCurrencyEnum, provider: WalletProviderEnum }) {
        const availableWallet = await this.paymentWalletModel.findOneAndUpdate(
            { 
                currency: data.currency, 
                provider: data.provider, 
                isLocked: false 
            },
            { 
                $set: { 
                    isLocked: true, 
                    paymentReference: data.paymentReference 
                } 
            },
            { new: true }
        );

        if (availableWallet) {
            return availableWallet;
        }

        const walletProvider = await this.getWalletProvider(data.provider);
        const cryptoWallet = await walletProvider.createWalletAddress();
        
        return await this.paymentWalletModel.create({
            paymentReference: data.paymentReference,
            currency: data.currency,
            provider: data.provider,
            status: cryptoWallet.status,
            balance: 0,
            address: cryptoWallet.publicAddress,
            privateKeyEncrypted: await this.walletEncryptionService.encrypt(cryptoWallet.privateKey),
            mnemonicEncrypted: cryptoWallet.mnemonic ? await this.walletEncryptionService.encrypt(cryptoWallet.mnemonic) : null,
            isLocked: true,
        });
    }

    async getWallet(data: {
        organizationId: string, 
        // currency: string,
        provider: WalletProviderEnum, status?: WalletStatusEnum
    }): Promise<Wallet | null> {
        return this.walletModel.findOne({
            organization: new Types.ObjectId(data.organizationId),
            // currency: data.currency,
            provider: data.provider,
            ...(data.status && { status: data.status }),
        });
    }

    async updateWallet(data: { organizationId: string, currency: string, provider: WalletProviderEnum }) {
        throw new NotImplementedException();
    }

    async deleteWallet(data: { organizationId: string, walletId: string }) {
        const wallet = await this.walletModel.findOne({
            organization: new Types.ObjectId(data.organizationId),
            _id: new Types.ObjectId(data.walletId),
        });

        if (!wallet) {
            throw new NotFoundException(`Wallet not found`);
        }

        return await wallet.deleteOne();
    }

    async listWallets(data: { organizationId: string }) {
        return this.walletModel.find({
            organization: new Types.ObjectId(data.organizationId),
        });
    }

    async getWalletBalance(data: { organizationId: string, walletId: string }) {
        const wallet = await this.walletModel.findOne({
            organization: new Types.ObjectId(data.organizationId),
            _id: new Types.ObjectId(data.walletId),
        });

        if (!wallet) {
            throw new NotFoundException(`Wallet not found`);
        }

        const walletProvider = await this.getWalletProvider(wallet.provider);
        return await walletProvider.getBalance(wallet.address);
    }
}