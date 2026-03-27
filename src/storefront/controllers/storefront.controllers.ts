import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import csv = require('csv-parser');
import { Readable } from 'stream';
import { ZodValidationPipe } from 'nestjs-zod';
import { StorefrontService } from '../storefront.service';
import { CreateProduct, UpdateProductDto, UpdateStorefrontDto } from '../dto/create.storefront.dto';
import { JWTAuthGuard } from 'src/auth/auth.guard';
import { csvProductSchema } from 'src/csv/dto/csv-product.dto';
import { Types } from 'mongoose';

@Controller('storefront')
export class StorefrontController {
  constructor(private readonly storefrontService: StorefrontService) { }

  @Post()
  @UseGuards(JWTAuthGuard)
  createStorefront(@Body(new ZodValidationPipe()) storefrontDto: UpdateStorefrontDto, @Req() req: any) {
    return this.storefrontService.updateOrCreateStorefront(new Types.ObjectId(req.organization._id), storefrontDto);
  }

  @Get(':id')
  getStorefront(@Param('id') id: string, @Req() req: any) {
    return this.storefrontService.getStorefront(new Types.ObjectId(id));
  }

  @Post('products')
  @UseGuards(JWTAuthGuard)
  createProduct(@Body(new ZodValidationPipe()) productDto: CreateProduct, @Req() req: any) {
    // const image = Image
    return this.storefrontService.createProduct({
      ...productDto,
      organization: new Types.ObjectId(req.organization._id)
    });
  }

  @Post('products/csv-upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JWTAuthGuard)
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const results: any[] = [];
    const errors: any[] = [];
    let rowNumber = 1;

    const stream = Readable.from(file.buffer);

    const parsedData: any[] = await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (data) => {
          const validatedRow = csvProductSchema.safeParse(data);
          if (validatedRow.success) {
            results.push(validatedRow.data);
          } else {
            errors.push({
              row: rowNumber,
              errors: validatedRow.error.flatten().fieldErrors,
            });
          }
          rowNumber++;
        })
        .on('end', () => {
          if (errors.length > 0) {
            reject(
              new BadRequestException({
                message: 'CSV Validation Failed',
                errors,
              }),
            );
          } else {
            resolve(results);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    try {
      // 1. Extract unique category names and trim them
      const categoryNames = parsedData
        .map((p) => p.category?.trim())
        .filter((c): c is string => !!c);

      // 2. Resolve category names to ObjectIds (find existing or create new)
      const categoryMap = await this.storefrontService.resolveCategoryIds(
        categoryNames,
        req.organization._id,
      );

      // 3. Map the product data to use their resolved category ObjectIds
      const productsToSave = parsedData.map((p) => ({
        ...p,
        category: p.category ? categoryMap[p.category.trim()] : undefined,
        organization: new Types.ObjectId(req.organization._id),
      }));

      // 4. Bulk insert products into the database
      const savedProducts =
        await this.storefrontService.createManyProducts(productsToSave);

      return {
        message: 'CSV Import successful',
        count: savedProducts.length,
        products: savedProducts,
      };
    } catch (error) {
      throw new BadRequestException({
        message: 'Failed to save products',
        error: error.message,
      });
    }
  }

  @Get(':storeId/products')
  getAllProducts(@Param('storeId') storeId: string, @Req() req: any) {
    return this.storefrontService.getAllProducts(storeId);
  }

  @Get(':storeId/products/:productId')
  getProductById(
    @Param('storeId') storeId: string,
    @Param('productId') productId: string, @Req() req: any) {
    return this.storefrontService.getProductById({
      storeId,
      productId,
    });
  }

  @Put('products/:id')
  @UseGuards(JWTAuthGuard)
  updateProduct(
    @Param('id') id: string,
    @Body(new ZodValidationPipe()) productDto: UpdateProductDto,
    @Req() req: any,
  ) {
    return this.storefrontService.updateProduct(
      {
        organizationId: req.organization._id,
        productId: id,
      },
      productDto,
    );
  }

  @Delete('products/:id')
  @UseGuards(JWTAuthGuard)
  deleteProduct(@Param('id') id: string, @Req() req: any) {
    return this.storefrontService.deleteProduct({
      productId: id,
      organizationId: req.organization._id,
    });
  }
}
