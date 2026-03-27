import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { OrganizationModule } from './organization/organization.module';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallets/wallet.module';
import { PaymentModule } from './payments/payment.module';
import { StorefrontModule } from './storefront/storefront.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    AuthModule,
    OrganizationModule,
    WalletModule,
    PaymentModule,
    StorefrontModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
