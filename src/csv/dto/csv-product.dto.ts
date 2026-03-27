import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const csvProductSchema = z.object({
  productName: z
    .string('Product name is required')
    .min(3, 'Product name is too short'),
  description: z.string().optional(),
  price: z.coerce.number('Price must be a number').default(0),
  category: z.string().optional(),
  currency: z.string('Currency is required'),
  images: z.preprocess(
    (val) =>
      typeof val === 'string' ? val.split(',').map((s) => s.trim()) : val,
    z.array(z.string()).default([]),
  ),
  quantity: z.coerce.number('Quantity must be a number').default(0),
});

export class CsvProductDto extends createZodDto(csvProductSchema) {}
