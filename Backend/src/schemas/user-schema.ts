import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,11}$/;
const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

export const RegisterUserSchema = z.object({
  fullName: z
    .string("Nama lengkap harus berupa teks.")
    .trim()
    .min(1, "Nama lengkap wajib diisi.")
    .min(3, "Nama lengkap minimal 3 karakter."),
  email: z
    .string("Email harus berupa teks.")
    .trim()
    .min(1, "Email wajib diisi.")
    .email("Format email tidak valid."),
  confirmPassword: z
    .string("Konfirmasi password harus berupa teks.")
    .min(1, "Konfirmasi password wajib diisi.")
    .min(8, "Konfirmasi password minimal 8 karakter."),
  password: z
    .string("Password harus berupa teks.")
    .min(1, "Password wajib diisi.")
    .min(8, "Password minimal 8 karakter.")
    .regex(
      passwordRegex,
      "Password harus mengandung setidaknya satu huruf besar, satu huruf kecil, dan satu angka.",
    ),
  telephoneNumber: z
    .string("Nomor telepon harus berupa teks.")
    .trim()
    .min(1, "Nomor telepon wajib diisi.")
    .regex(phoneRegex, "Format nomor telepon yang Anda masukkan tidak valid."),
  dob: z
    .string("Tanggal lahir harus berupa teks.")
    .trim()
    .min(1, "Tanggal lahir wajib diisi.")
    .regex(
      dateOnlyRegex,
      "Tanggal lahir harus menggunakan format YYYY-MM-DD (contoh: 2026-04-01).",
    ),
  gender: z
    .enum(["MALE", "FEMALE", "OTHER"], {
      error: "Gender harus MALE, FEMALE, atau OTHER.",
    })
    .optional(),
  specializationId: z
    .number("Specialization ID harus berupa angka.")
    .int("Specialization ID harus berupa bilangan bulat.")
    .positive("Specialization ID wajib bernilai lebih dari 0.")
    .optional(),
  strNumber: z
    .string("STR Number harus berupa teks.")
    .trim()
    .min(1, "STR Number tidak boleh kosong.")
    .optional(),
});

export const LoginUserSchema = z.object({
  email: z
    .string("Email harus berupa teks.")
    .trim()
    .min(1, "Email wajib diisi.")
    .email("Format email tidak valid."),
  password: z
    .string("Password harus berupa teks.")
    .min(1, "Password wajib diisi.")
    .min(8, "Password minimal 8 karakter."),
});

export const EditUserSchema = z.object({
  fullName: z
    .string("Nama lengkap harus berupa teks.")
    .trim()
    .min(3, "Nama lengkap minimal 3 karakter.")
    .optional(),
  telephoneNumber: z
    .string("Nomor telepon harus berupa teks.")
    .trim()
    .min(1, "Nomor telepon wajib diisi.")
    .regex(phoneRegex, "Format nomor telepon yang Anda masukkan tidak valid."),
  dob: z
    .string("Tanggal lahir harus berupa teks.")
    .trim()
    .min(1, "Tanggal lahir wajib diisi.")
    .regex(
      dateOnlyRegex,
      "Tanggal lahir harus menggunakan format YYYY-MM-DD (contoh: 2026-04-01).",
    ),
  gender: z
    .enum(["MALE", "FEMALE", "OTHER"] as const, {
      error: "Gender harus MALE, FEMALE, atau OTHER.",
    })
    .optional(),
  specializationId: z
    .number("Specialization ID harus berupa angka.")
    .int("Specialization ID harus berupa bilangan bulat.")
    .positive("Specialization ID wajib bernilai lebih dari 0.")
    .optional(),
  strNumber: z
    .string("STR Number harus berupa teks.")
    .trim()
    .min(1, "STR Number tidak boleh kosong.")
    .optional(),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z
    .string("Refresh token harus berupa teks.")
    .min(1, "Refresh token wajib diisi."),
});

export const AddressSchema = z.object({
  label: z.string("Label alamat harus berupa teks.").trim().optional(),
  streetAddress: z
    .string("Alamat jalan harus berupa teks.")
    .trim()
    .min(1, "Alamat jalan wajib diisi.")
    .min(5, "Alamat jalan minimal 5 karakter."),
  city: z
    .string("Kota harus berupa teks.")
    .trim()
    .min(1, "Kota wajib diisi.")
    .min(2, "Kota minimal 2 karakter."),
  postalCode: z
    .string("Kode pos harus berupa teks.")
    .trim()
    .min(1, "Kode pos wajib diisi.")
    .min(3, "Kode pos minimal 3 karakter."),
  isDefault: z.boolean("isDefault harus berupa nilai boolean.").default(false),
});

export const UpdatePasswordSchema = z.object({
  oldPassword: z
    .string("Password lama harus berupa teks.")
    .min(1, "Password lama wajib diisi."),
  newPassword: z
    .string("Password baru harus berupa teks.")
    .min(1, "Password baru wajib diisi.")
    .min(8, "Password baru minimal 8 karakter.")
    .regex(
      passwordRegex,
      "Password baru harus mengandung setidaknya satu huruf besar, satu huruf kecil, dan satu angka.",
    ),
});
