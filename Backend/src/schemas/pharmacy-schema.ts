import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const CreateProductSchema = z.object({
  categoryId: z.number().int().positive("Invalid category ID"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  imageUrl: z.string().url("Invalid URL").optional(),
});

export const UpdateProductStockSchema = z.object({
  quantity: z.number().int(),
});
