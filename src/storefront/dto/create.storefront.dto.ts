import { email, z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createProductDto = z.object({
  productName: z.string('Product name is too short').min(3),
  description: z.string().optional(),
  price: z.number().default(0),
  category: z.string().optional(),
  currency: z.string(),
  images: z.array(z.string()),
  quantity: z.number().default(0),
});

export const categoryDto = z.object({
  name: z.string('Category name is required').min(3),
  image: z.string().optional(),
  description: z.string().optional(),
});

export const updateCategoryDto = categoryDto.partial();

export const updateProductDto = createProductDto.partial();

// Create a DTO from the schema
export class CreateProduct extends createZodDto(createProductDto) {}
export class UpdateProductDto extends createZodDto(updateProductDto) {}
export class ProductCategoryDto extends createZodDto(categoryDto) {}
export class UpdateProductCategoryDto extends createZodDto(updateCategoryDto) {}
