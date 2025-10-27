import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createUserSchema = z.strictObject({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  email: z.email(),
  password: z.string().min(6),
  phone: z.string().trim().min(1).optional()
});

export class CreateUserDto extends createZodDto(createUserSchema) {}
