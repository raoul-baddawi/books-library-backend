import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const findUsersSchema = z.strictObject({
  search: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(10).max(50).optional(),
  offset: z.coerce.number().int().nonnegative().optional()
});

export class FindUsersDto extends createZodDto(findUsersSchema) {}
