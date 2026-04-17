import { z } from "zod";

export const AddToCartSchema = z.object({
  productId: z.number().int().positive("Invalid product ID"),
  quantity: z.number().int().positive("Quantity must be greater than 0"),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().nonnegative("Quantity cannot be negative"), // 0 conceptually means remove
});

export const CreateOrderSchema = z.object({
  shippingAddress: z.string().min(5, "Valid shipping address is required"),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELLED"]),
});

export const AdminCreateProductSchema = z.object({
  categoryId: z.coerce.number().int().positive("Invalid category ID"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  imageUrl: z.string().url("Invalid image URL").optional(),
});

export const AdminUpdateProductSchema = z
  .object({
    categoryId: z.coerce
      .number()
      .int()
      .positive("Invalid category ID")
      .optional(),
    name: z.string().min(1, "Product name is required").optional(),
    description: z.string().optional(),
    price: z.coerce
      .number()
      .positive("Price must be greater than 0")
      .optional(),
    stock: z.coerce
      .number()
      .int()
      .nonnegative("Stock cannot be negative")
      .optional(),
    imageUrl: z.string().url("Invalid image URL").optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field must be provided",
  });
