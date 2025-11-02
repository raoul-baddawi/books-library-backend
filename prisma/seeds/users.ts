import { faker } from "@faker-js/faker/locale/fr";
import * as argon from "argon2";

import type { Prisma, PrismaClient } from "$prisma/client";

async function generateUserSeed() {
  const passwordHash = await argon.hash("test123");
  const randomInt = Math.floor(Math.random() * 100);
  const isEven = randomInt % 2 === 0;
  return {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: passwordHash,
    role: isEven ? "ADMIN" : "AUTHOR"
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

  const seededUsers = await Promise.all(
    Array.from({ length }, () => generateUserSeed())
  );

  await prisma.user.createMany({
    data: seededUsers,
    skipDuplicates: true
  });
}
