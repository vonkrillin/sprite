import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Products,
  ProductCategory,
  ProductSchema,
  ProductCategorySchema,
} from 'src/models/products';
import { Storefront, StorefrontSchema } from 'src/models/storefront';
import { StorefrontService } from './storefront.service';
import { StorefrontController } from './controllers/storefront.controllers';
import { CategoriesController } from './controllers/categories.controller';
import { StorefrontDashboardController } from './controllers/storefront-dashboard.controller';
import { PaymentModule } from '../payments/payment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Products.name, schema: ProductSchema },
      {
        name: ProductCategory.name,
        schema: ProductCategorySchema,
      },
      {
        name: Storefront.name,
        schema: StorefrontSchema,
      },
    ]),
    PaymentModule,
  ],
  controllers: [
    StorefrontController,
    CategoriesController,
    StorefrontDashboardController,
  ],
  providers: [StorefrontService],
  exports: [StorefrontService],
})
export class StorefrontModule {}
