import { fullNameReturner } from "$/utils/misc";
import type { Prisma, UserRoleEnum } from "$prisma/index";

type MeUserTransformed = {
  id: number;
  fullName: string;
  role: UserRoleEnum;
};

type FullUserType = Prisma.UserGetPayload<{
  include: {
    books: true;
  };
}>;
export function getMeTransformer(data: FullUserType): MeUserTransformed {
  const { id, firstName, lastName, role } = data;
  return {
    id,
    role,
    fullName: fullNameReturner(firstName, lastName)
  };
}
