import { z } from "zod";

const MenuItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  photoSrc: z.string().nullable(),
  active: z.boolean(),
  business: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const MenuArraySchema = z.array(MenuItemSchema);

const BaseRestaurantMenuSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  active: z.boolean(),
});

const CreateRestaurantMenuSchema = BaseRestaurantMenuSchema;

const UpdateRestaurantMenuSchema = BaseRestaurantMenuSchema.merge(
  z.object({
    id: z.number(),
  })
);

type MenuItem = z.infer<typeof MenuItemSchema>;
type MenuArray = z.infer<typeof MenuArraySchema>;
type BaseRestaurantMenu = z.infer<typeof BaseRestaurantMenuSchema>;
type CreateRestaurantMenu = z.infer<typeof CreateRestaurantMenuSchema>;
type UpdateRestaurantMenu = z.infer<typeof UpdateRestaurantMenuSchema>;

export {
  BaseRestaurantMenuSchema,
  CreateRestaurantMenuSchema,
  MenuArraySchema,
  MenuItemSchema,
  UpdateRestaurantMenuSchema,
};

export type {
  BaseRestaurantMenu,
  CreateRestaurantMenu,
  MenuArray,
  MenuItem,
  UpdateRestaurantMenu,
};
