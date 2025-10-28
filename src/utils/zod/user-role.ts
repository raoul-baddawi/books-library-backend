import { UserRoleEnum } from "$prisma/index";
import z from "zod";

export const zodRoleEnumSchema = z.enum([
  UserRoleEnum.USER,
  UserRoleEnum.ADMIN,
  UserRoleEnum.AUTHOR
]);
