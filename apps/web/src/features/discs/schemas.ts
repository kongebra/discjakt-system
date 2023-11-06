import { z } from "zod";

export const discSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().optional(),
  image_url: z.string(),

  speed: z.number().min(1).max(16),
  glide: z.number().min(1).max(8),
  turn: z.number().min(-5).max(3),
  fade: z.number().min(0).max(6),

  type: z.enum(["PUTTER", "MIDRANGE", "FAIRWAY", "DISTANCE"]),

  manufacturer_slug: z.string().min(1).max(255),
});

export type DiscFields = z.infer<typeof discSchema>;
