import { email, z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createOrgDto = z
  .object({
    businessName: z.string('Business name is too short').min(3),
    email: z.email('Email is required'),
    password: z
      .string('Password is required')
      .min(6, 'Password should be 6 characters long'),
  })
  .required();

export const loginZodDto = z
  .object({
    email: z.email('Email is required'),
    password: z
      .string('Password is required')
      .min(6, 'Password should be 6 characters long'),
  })
  .required();
// Create a DTO from the schema
export class CreateOrgDto extends createZodDto(createOrgDto) {}
export class LoginOrgDto extends createZodDto(loginZodDto) {}
