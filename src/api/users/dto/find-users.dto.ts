import { dateRangeSchema } from "$/utils/zod/date-range";
import { findGeneralSchema } from "$/utils/zod/general-paginated-get";
import { createZodDto } from "nestjs-zod";

export const findUsersSchema = findGeneralSchema.extend({
  dateRange: dateRangeSchema.optional()
});

export class FindUsersDto extends createZodDto(findUsersSchema) {}
