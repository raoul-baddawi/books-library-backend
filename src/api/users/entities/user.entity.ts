import { fullNameReturner } from "$/utils/misc";
import type { User } from "$prisma/client";

export function userTransformer(user: User) {
  const { id, role, email, firstName, lastName, createdAt } = user;

  return {
    id,
    role,
    email,
    createdAt,
    fullName: fullNameReturner(firstName, lastName)
  };
}
