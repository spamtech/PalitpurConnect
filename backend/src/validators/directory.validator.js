import { z } from "zod";

export const directorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(200),

  category: z
    .string()
    .trim()
    .min(2)
    .max(100),

  description: z
    .string()
    .trim()
    .max(5000)
    .optional(),

  phone: z
    .string()
    .trim()
    .max(30)
    .optional(),

  email: z
    .string()
    .email()
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .trim()
    .max(1000)
    .optional(),

  imageUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal("")),
});