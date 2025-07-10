import { z } from "zod";
import { RestaurantSchema } from "./restaurants.types";

export const BusinessSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  photoSrc: z.string().nullable(),
  owner: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  restaurants: z.array(RestaurantSchema),
});

export const BusinessArraySchema = z.array(BusinessSchema);

export type Business = z.infer<typeof BusinessSchema>;
export type BusinessArray = z.infer<typeof BusinessArraySchema>;
