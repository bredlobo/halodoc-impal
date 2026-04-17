import { z } from "zod";

const dateOnlySchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "Date must use YYYY-MM-DD format (example: 2026-04-01)",
  );

export const RegisterUserSchema = z.object({
  fullName: z.string().min(3, "Full name minimal 3 karakter"),
  email: z.string().email("email tidak valid"),
  confirmPassword: z.string().min(8, "Confirm password minimal 8 karakter"),
  password: z.string().min(8, "Password minimal 8 Karakter"),
  telephoneNumber: z
    .string()
    .regex(/^\+?[0-9]{8,15}$/, "Telephone number is not valid")
    .optional(),
  dob: dateOnlySchema.optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  specializationId: z.number().int().positive().optional(),
  strNumber: z.string().optional(),
});

export const LoginUserSchema = z.object({
  email: z.string().email("Email Tidak Valid"),
  password: z.string().min(8, "Password minimal 8 Karakter"),
});

export const EditUserSchema = z.object({
  fullName: z.string().min(3, "Nama Lengkap minimal 3 Karakter").optional(),
  telephoneNumber: z
    .string()
    .regex(/^\+?[0-9]{8,15}$/, "Telephone number is not valid")
    .optional(),
  dob: dateOnlySchema.optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  specializationId: z.number().int().positive().optional(),
  strNumber: z.string().optional(),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const AddressSchema = z.object({
  label: z.string().optional(),
  streetAddress: z.string().min(5, "Alamat jalan minimal 5 karakter"),
  city: z.string().min(2, "Kota harus diisi"),
  postalCode: z.string().min(3, "Kode pos harus diisi"),
  isDefault: z.boolean().default(false),
});

export const UpdatePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Password lama harus diisi"),
  newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
});
