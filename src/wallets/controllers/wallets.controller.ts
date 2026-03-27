import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { WalletsService } from "../wallets.service";
import { ZodValidationPipe } from "nestjs-zod";
import { createWalletSchema, type CreateWalletDto } from "../dto/create-wallet.dto";
import { JWTAuthGuard } from "../../auth/auth.guard";


@Controller('wallets')
export class WalletsController {
    constructor(private readonly walletService: WalletsService) { }

    @Post()
    @UseGuards(JWTAuthGuard)
    async createWallet(
        @Body(new ZodValidationPipe(createWalletSchema)) createWalletDto: CreateWalletDto,
        @Req() req: any
    ) {
        const wallet = await this.walletService.createWallet({
            ...createWalletDto,
            organizationId: req.organization._id,
        });

        return { wallet };
    }

    @Get()
    @UseGuards(JWTAuthGuard)
    async listWallets(@Req() req: any) {
        const wallets = await this.walletService.listWallets({
            organizationId: req.organization._id,
        });

        return { wallets };
    }
}