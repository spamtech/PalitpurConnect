import { z } from "zod";

export const createGrievanceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  mobile: z
    .string()
    .trim()
    .min(10)
    .max(15),

  category: z
    .string()
    .trim()
    .min(2)
    .max(100),

  description: z
    .string()
    .trim()
    .min(10)
    .max(5000),
});