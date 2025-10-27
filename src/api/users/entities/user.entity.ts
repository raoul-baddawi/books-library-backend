import type { User } from "$prisma/client";

export function userTransformer(user: User) {
  const {
    sub: _sub,
    createdAt: _createAt,
    updatedAt: _updatedAt,
    ...restUserFields
  } = user;

  return {
    ...restUserFields,
    fullName: `${user.firstName} ${user.lastName}`
  };
}
