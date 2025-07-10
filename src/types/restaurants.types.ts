import { z } from "zod";

export const RestaurantSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  photoSrc: z.string().nullable(),
  business: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Restaurant = z.infer<typeof RestaurantSchema>;
