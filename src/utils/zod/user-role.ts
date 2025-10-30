import z from "zod";

import { UserRoleEnum } from "$prisma/index";

export const zodRoleEnumSchema = z.enum([
  UserRoleEnum.USER,
  UserRoleEnum.ADMIN,
  UserRoleEnum.AUTHOR
]);
