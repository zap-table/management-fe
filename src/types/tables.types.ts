import z from "zod";

export const TableStatusSchema = z.enum(["available", "occupied", "reserved"]);

export const TableSchema = z.object({
  id: z.number(),
  tableNumber: z.number(),
  qrCodeUrl: z.string().nullable(),
  qrCodeKey: z.string().nullable(),
  active: z.boolean(),
  status: TableStatusSchema,
  restaurant: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateTableRequestSchema = z.object({
  tableNumber: z.number().min(1, "Table number must be at least 1"),
  restaurantId: z.number(),
  active: z.boolean(),
  status: TableStatusSchema,
});

export const UpdateTableSchema = CreateTableRequestSchema.partial();

export const ChangeTableStatusRequestSchema = z.object({
  newStatus: TableStatusSchema,
});

export const UpdateTableRequestSchema = TableSchema.partial();

export type Table = z.infer<typeof TableSchema>;
export type TableStatus = z.infer<typeof TableStatusSchema>;
export type CreateTableRequest = z.infer<typeof CreateTableRequestSchema>;
export type UpdateTable = z.infer<typeof UpdateTableSchema>;
export type ChangeTableStatusRequest = z.infer<
  typeof ChangeTableStatusRequestSchema
>;
export type UpdateTableRequest = z.infer<typeof UpdateTableRequestSchema>;
