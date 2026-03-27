import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Body,
  UseGuards,
  Req,
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
    @Req() req: any,
  ) {
    return this.storefrontService.createCategory(
      categoryDto,
      req.organization._id,
    );
  }

  @Get()
  getAllCategories(@Req() req: any) {
    return this.storefrontService.getAllCategories(req.organization._id);
  }

  @Get(':id')
  getCategoryById(@Param('id') id: string, @Req() req: any) {
    return this.storefrontService.getCategoryById({
      id,
      organizationId: req.organization._id,
    });
  }

  @Put(':id')
  updateCategory(
    @Param('id') id: string,
    @Body(new ZodValidationPipe()) categoryDto: UpdateProductCategoryDto,
    @Req() req: any,
  ) {
    return this.storefrontService.updateCategory(
      { id, organizationId: req.organization._id },
      categoryDto,
    );
  }

  @Delete(':id')
  deleteCategory(@Param('id') id: string, @Req() req: any) {
    return this.storefrontService.deleteCategory({
      id,
      organizationId: req.organization._id,
    });
  }
}
