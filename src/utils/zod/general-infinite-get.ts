import { z } from "zod";

export const generalInfiniteGetSchema = z.strictObject({
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(10).max(50).optional()
});
