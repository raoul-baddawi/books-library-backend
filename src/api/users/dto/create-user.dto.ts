import { zodRoleEnumSchema } from "$/utils/zod/user-role";
import { UserRoleEnum } from "$prisma/index";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createUserSchema = z.strictObject({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  email: z.email(),
  password: z.string().min(6),
  role: zodRoleEnumSchema.default(UserRoleEnum.USER)
});

export class CreateUserDto extends createZodDto(createUserSchema) {}
