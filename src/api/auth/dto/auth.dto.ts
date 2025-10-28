import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const LoginUser = z.strictObject({
  email: z.email().min(1, {
    message: "E-mail is required"
  }),
  password: z.string().min(1, {
    message: "Password is required"
  })
});

export const RegisterUser = LoginUser.extend({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  confirmPassword: z.string().min(1, {
    message: "Confirm Password is required"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export class LoginUserDto extends createZodDto(LoginUser) {}
export class RegisterUserDto extends createZodDto(RegisterUser) {}
