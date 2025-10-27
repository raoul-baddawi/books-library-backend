import { faker } from "@faker-js/faker/locale/fr";

import type { Prisma, PrismaClient } from "$prisma/client";

function generateUserSeed() {
  return {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password()
  } satisfies Prisma.UserCreateManyInput;
}

type SeedUsersOptions = {
  length?: number;
};

export async function seedUsers(
  prisma: PrismaClient,
  options?: SeedUsersOptions
) {
  const length = options?.length || 10;

  const seededUsers = Array.from({ length }, () => generateUserSeed());

  await prisma.user.createMany({
    data: seededUsers,
    skipDuplicates: true
  });
}
