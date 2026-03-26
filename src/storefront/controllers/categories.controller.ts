import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { StorefrontService } from '../storefront.service';
import {
  ProductCategoryDto,
  UpdateProductCategoryDto,
} from '../dto/create.storefront.dto';
import { JWTAuthGuard } from 'src/auth/auth.guard';

@Controller('categories')
@UseGuards(JWTAuthGuard)
export class CategoriesController {
  constructor(private readonly storefrontService: StorefrontService) {}

  @Post()
  createCategory(
    @Body(new ZodValidationPipe()) categoryDto: ProductCategoryDto,
  ) {
    return this.storefrontService.createCategory(categoryDto);
  }

  @Get()
  getAllCategories() {
    return this.storefrontService.getAllCategories();
  }

  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.storefrontService.getCategoryById(id);
  }

  @Put(':id')
  updateCategory(
    @Param('id') id: string,
    @Body(new ZodValidationPipe()) categoryDto: UpdateProductCategoryDto,
  ) {
    return this.storefrontService.updateCategory(id, categoryDto);
  }

  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.storefrontService.deleteCategory(id);
  }
}
