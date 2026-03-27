import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { OrganizationModule } from '../organization/organization.module';
import { StorefrontModule } from '../storefront/storefront.module';
import { WalletModule } from '../wallets/wallet.module';

@Module({
  imports: [OrganizationModule, StorefrontModule, WalletModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
