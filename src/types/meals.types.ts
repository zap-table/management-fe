import { z } from "zod";

const MealSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  photoSrc: z.string().nullable(),
  defaultPrice: z
    .string()
    .regex(
      /^-?\d+(\.\d{1,2})?$/,
      "Preço tem que ser um numéro valido até duas casas decimais"
    ),
  business: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const MealListSchema = z.array(MealSchema);

const BaseMealSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  defaultPrice: z
    .string()
    .regex(
      /^-?\d+(\.\d{1,2})?$/,
      "Preço tem que ser um numéro valido até duas casas decimais"
    ),
});

const CreateMealSchema = BaseMealSchema;

const UpdateMealSchema = CreateMealSchema.partial();

type Meal = z.infer<typeof MealSchema>;
type MealList = z.infer<typeof MealListSchema>;
type BaseMeal = z.infer<typeof BaseMealSchema>;
type CreateMeal = z.infer<typeof CreateMealSchema>;
type UpdateMeal = z.infer<typeof UpdateMealSchema>;

export {
  BaseMealSchema,
  CreateMealSchema,
  MealListSchema,
  MealSchema,
  UpdateMealSchema,
};

export type { BaseMeal, CreateMeal, Meal, MealList, UpdateMeal };
