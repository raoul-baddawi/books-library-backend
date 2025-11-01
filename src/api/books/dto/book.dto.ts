import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { dateRangeSchema } from "$/utils/zod/date-range";
import { generalInfiniteGetSchema } from "$/utils/zod/general-infinite-get";
import { generalTablePaginationSchema } from "$/utils/zod/general-paginated-get";

export const createBookSchema = z.strictObject({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  media: z.array(z.string()).optional(),
  genre: z.string().trim().min(1),
  authorId: z
    .string()
    .trim()
    .min(1)
    .transform((val) => Number(val))
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

export const findAdminBooksSchema = generalTablePaginationSchema.extend({
  filters: z
    .strictObject({
      search: z.string().optional(),
      genre: z.array(z.string()).optional(),
      author: z.array(z.string()).optional(),
      dateRange: dateRangeSchema.optional().nullable()
    })
    .optional()
});

export class FindAdminBooksDto extends createZodDto(findAdminBooksSchema) {}
export class FindBooksDto extends createZodDto(findBooksSchema) {}
export class CreateBookDto extends createZodDto(createBookSchema) {}
export class UpdateBookDto extends createZodDto(updateBookSchema) {}
