import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must contain at least 2 characters")
    .max(100),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(100),

  confirmPassword: z
    .string()
    .min(8),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

export const verifyEmailSchema = z.object({
  email: z
    .string()
    .email()
    .transform((value) => value.toLowerCase()),

  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must contain 6 digits"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .transform((value) => value.toLowerCase()),

  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email()
    .transform((value) => value.toLowerCase()),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .email()
    .transform((value) => value.toLowerCase()),

  otp: z
    .string()
    .regex(/^\d{6}$/),

  password: z
    .string()
    .min(8),

  confirmPassword: z
    .string()
    .min(8),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);