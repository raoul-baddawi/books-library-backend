import z from "zod";

import { UserRoleEnum } from "$prisma/index";

export const zodRoleEnumSchema = z.enum([
  UserRoleEnum.ADMIN,
  UserRoleEnum.AUTHOR
]);
