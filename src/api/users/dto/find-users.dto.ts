import { createZodDto } from "nestjs-zod";

import { dateRangeSchema } from "$/utils/zod/date-range";
import { generalTablePaginationSchema } from "$/utils/zod/general-paginated-get";
import z from "zod";
import { zodRoleEnumSchema } from "$/utils/zod/user-role";

export const findUsersSchema = generalTablePaginationSchema.extend({
  filters: z
    .strictObject({
      search: z.string().trim().min(1).optional(),
      dateRange: dateRangeSchema.optional().nullable(),
      role: zodRoleEnumSchema.optional()
    })
    .optional()
});

export class FindUsersDto extends createZodDto(findUsersSchema) {}
