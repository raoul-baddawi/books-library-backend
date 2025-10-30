import { z } from "zod";

export const generalTablePaginationSchema = z.strictObject({
  pagination: z
    .object({
      offset: z.coerce.number().int().min(0).optional(),
      limit: z.coerce.number().int().min(10).max(50).optional()
    })
    .optional(),
  sorting: z
    .object({
      key: z.string().trim().min(1),
      order: z.enum(["asc", "desc"]).optional()
    })
    .optional()
});
