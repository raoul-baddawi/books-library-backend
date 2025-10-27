import { exec } from "node:child_process";

import { Logger } from "@nestjs/common";

import { PrismaClient } from "../generated/prisma/client";
import { seedBooks } from "./seeds/books";
import { seedUsers } from "./seeds/users";

const prisma = new PrismaClient();

async function clearDatabase() {
  await new Promise((resolve, reject) => {
    exec("pnpm exec prisma db push --force-reset", (err, stdout) => {
      if (err) {
        reject(err);
      }
      resolve(stdout);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const shouldReset = args.includes("--clear");

  if (shouldReset) {
    Logger.log("Clearing database...");
    await clearDatabase();
    Logger.log("Database cleared!");
  }

  Logger.log("Seeding users...");
  await seedUsers(prisma);
  Logger.log("Users seeded!");
  const userIds = (await prisma.user.findMany({ select: { id: true } })).map(
    ({ id }) => id
  );

  Logger.log("Seeding books...");
  await seedBooks(prisma, { authorIds: userIds });
  Logger.log("Books seeded!");
}

main()
  .then(async () => {
    Logger.log("Seeding complete!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    Logger.fatal(e);
    await prisma.$disconnect();
    process.exit(1);
  });
