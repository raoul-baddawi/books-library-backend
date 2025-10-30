import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { dateRangeSchema } from "$/utils/zod/date-range";
import { generalInfiniteGetSchema } from "$/utils/zod/general-infinite-get";

export const createBookSchema = z.strictObject({
  name: z.string().trim().min(1),
  media: z.array(z.string()),
  description: z.string().trim().min(1),
  genre: z.string().trim().min(1)
});
export const updateBookSchema = createBookSchema.partial();

export const findBooksSchema = generalInfiniteGetSchema.extend({
  dateRange: dateRangeSchema.optional().nullable(),
  genre: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val ? val.split(",").map((g) => g.trim()) : undefined))
});

export class FindBooksDto extends createZodDto(findBooksSchema) {}
export class CreateBookDto extends createZodDto(createBookSchema) {}
export class UpdateBookDto extends createZodDto(updateBookSchema) {}
