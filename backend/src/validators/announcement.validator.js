import { z } from "zod";

export const announcementSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3)
    .max(200),

  description: z
    .string()
    .trim()
    .min(5)
    .max(10000),

  category: z
    .string()
    .trim()
    .min(2)
    .max(100),

  imageUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal("")),

  isPublished: z
    .boolean()
    .optional(),
});