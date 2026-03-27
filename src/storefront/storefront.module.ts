import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Products,
  ProductCategory,
  ProductSchema,
  ProductCategorySchema,
} from 'src/models/products';
import { StorefrontService } from './storefront.service';
import { StorefrontController } from './controllers/storefront.controllers';
import { CategoriesController } from './controllers/categories.controller';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Products.name, schema: ProductSchema },
      {
        name: ProductCategory.name,
        schema: ProductCategorySchema,
      },
    ]),
  ],
  controllers: [StorefrontController, CategoriesController],
  providers: [StorefrontService],
  exports: [StorefrontService],
})
export class StorefrontModule {}
