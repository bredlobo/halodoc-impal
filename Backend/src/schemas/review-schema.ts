import { z } from "zod";

export const SubmitRatingSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5"),
  review: z.string().optional(),
  type: z.enum(["PRODUCT", "DOCTOR"]),
  targetId: z
    .number()
    .int()
    .positive("Invalid target ID (Doctor or Product Profile ID)"),
  productId: z.number().int().positive().optional(),
});
