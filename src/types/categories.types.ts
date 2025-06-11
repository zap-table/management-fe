import { z } from "zod";
import { MealSchema } from "./meals.types";

const BasicCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  color: z.string().nullable(),
  business: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const BasicCategoryListSchema = z.array(BasicCategorySchema);

const DetailedCategorySchema = BasicCategorySchema.merge(
  z.object({
    meals: z.array(MealSchema),
  })
);

const DetailedCategoryListSchema = z.array(DetailedCategorySchema);

const CreateCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  menuIds: z.array(z.number()).optional(),
  mealIds: z.array(z.number()).optional(),
});

const UpdateCategorySchema = CreateCategorySchema.partial();

type BasicCategory = z.infer<typeof BasicCategorySchema>;
type BasicCategoryList = z.infer<typeof BasicCategoryListSchema>;
type DetailedCategory = z.infer<typeof DetailedCategorySchema>;
type DetailedCategoryList = z.infer<typeof DetailedCategoryListSchema>;
type CreateCategory = z.infer<typeof CreateCategorySchema>;
type UpdateCategory = z.infer<typeof UpdateCategorySchema>;

export {
  BasicCategoryListSchema,
  BasicCategorySchema,
  CreateCategorySchema,
  DetailedCategoryListSchema,
  DetailedCategorySchema,
  UpdateCategorySchema,
};

export type {
  BasicCategory,
  BasicCategoryList,
  CreateCategory,
  DetailedCategory,
  DetailedCategoryList,
  UpdateCategory,
};
