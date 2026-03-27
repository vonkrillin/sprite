import {
  Controller,
  Get,
  Post,
  Render,
  Res,
  UseGuards,
  Req,
  Body,
  Param,
} from '@nestjs/common';
import { WalletsService } from '../wallets.service';
import { type Response } from 'express';
import { CookieSSRGuard } from '../../auth/auth.guard';
import { WalletProviderEnum } from '../../enums';

@Controller('dashboard/wallets')
@UseGuards(CookieSSRGuard)
export class WalletsDashboardController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  @Render('dashboard/wallets/index')
  async getWallets(@Req() req: any) {
    const organizationId = req.organization._id;
    const wallets = await this.walletsService.listWallets({ organizationId });
    return { title: 'Wallets', wallets, showSidebar: true };
  }

  @Get('create')
  @Render('dashboard/wallets/create')
  getCreateWallet() {
    return { 
      title: 'Create Wallet', 
      providers: Object.values(WalletProviderEnum)
      .filter((provider) => provider !== WalletProviderEnum.BASE),
      showSidebar: true 
    };
  }

  @Post('create')
  async postCreateWallet(
    @Body('provider') provider: WalletProviderEnum,
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      const organizationId = req.organization._id;
      await this.walletsService.createWallet({ organizationId, provider });
      return res.redirect('/dashboard/wallets');
    } catch (error) {
      return res.render('dashboard/wallets/create', {
        title: 'Create Wallet',
        providers: Object.values(WalletProviderEnum),
        showSidebar: true,
        error: error.message || 'An error occurred during wallet creation',
      });
    }
  }

  @Post(':id/delete')
  async deleteWallet(
    @Param('id') walletId: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      const organizationId = req.organization._id;
      await this.walletsService.deleteWallet({ organizationId, walletId });
      return res.redirect('/dashboard/wallets');
    } catch (error) {
      // For simplicity, redirect with error or just redirect
      return res.redirect('/dashboard/wallets');
    }
  }
}
