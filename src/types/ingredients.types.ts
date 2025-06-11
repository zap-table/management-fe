import { z } from "zod";
import { MealSchema } from "./meals.types";

const BasicIngredientSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  photoSrc: z.string().nullable(),
  business: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const BasicIngredientListSchema = z.array(BasicIngredientSchema);

const DetailedIngredientSchema = BasicIngredientSchema.merge(
  z.object({
    meals: z.array(MealSchema),
  })
);

const DetailedIngredientListSchema = z.array(DetailedIngredientSchema);

const CreateIngredientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  meals: z.array(z.number()).optional(),
});

const UpdateIngredientSchema = CreateIngredientSchema.partial();

type BasicIngredient = z.infer<typeof BasicIngredientSchema>;
type BasicIngredientList = z.infer<typeof BasicIngredientListSchema>;
type DetailedIngredient = z.infer<typeof DetailedIngredientSchema>;
type DetailedIngredientList = z.infer<typeof DetailedIngredientListSchema>;
type CreateIngredient = z.infer<typeof CreateIngredientSchema>;
type UpdateIngredient = z.infer<typeof UpdateIngredientSchema>;

export {
  BasicIngredientListSchema,
  BasicIngredientSchema,
  CreateIngredientSchema,
  DetailedIngredientListSchema,
  DetailedIngredientSchema,
  UpdateIngredientSchema,
};

export type {
  BasicIngredient,
  BasicIngredientList,
  CreateIngredient,
  DetailedIngredient,
  DetailedIngredientList,
  UpdateIngredient,
};
