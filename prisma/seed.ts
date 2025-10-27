import { exec } from "node:child_process";

import { Logger } from "@nestjs/common";

import { PrismaClient } from "$prisma/client";

import { seedComments } from "./seeds/comments";
import { seedPosts } from "./seeds/posts";
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
  const userIds = (await prisma.user.findMany({ select: { id: true } })).map(
    ({ id }) => id
  );

  Logger.log("Seeding posts...");
  await seedPosts(prisma, { authorIds: userIds });
  const postIds = (await prisma.post.findMany({ select: { id: true } })).map(
    ({ id }) => id
  );

  Logger.log("Seeding comments...");
  await seedComments(prisma, { postIds, authorIds: userIds });
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
