import { createZodDto } from "nestjs-zod";
import { dateRangeSchema } from "$/utils/zod/date-range";
import { findGeneralSchema } from "$/utils/zod/general-paginated-get";
import { z } from "zod";

export const createBookSchema = z.strictObject({
  name: z.string().trim().min(1),
  media: z.array(z.string()),
  description: z.string().trim().min(1)
});
export const updateBookSchema = createBookSchema.partial();

export const findBooksSchema = findGeneralSchema.extend({
  dateRange: dateRangeSchema.optional().nullable()
});

export class FindBooksDto extends createZodDto(findBooksSchema) {}
export class CreateBookDto extends createZodDto(createBookSchema) {}
export class UpdateBookDto extends createZodDto(updateBookSchema) {}
