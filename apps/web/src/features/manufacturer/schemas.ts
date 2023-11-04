import { z } from "zod";

export const manufacturerSchema = z.object({
  name: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string().optional(),
  image_url: z.string().optional(),
});

export type ManufacturerFields = z.infer<typeof manufacturerSchema>;
