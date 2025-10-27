import { faker } from "@faker-js/faker/locale/fr";

import type { Prisma, PrismaClient } from "$prisma/client";

function generatePostSeed(authorId: number) {
  const isPublished = faker.datatype.boolean();
  const publishedAt = isPublished ? faker.date.past() : null;

  return {
    title: faker.lorem.sentence({ min: 3, max: 7 }),
    content: faker.lorem.paragraphs(),
    published: isPublished,
    publishedAt,
    authorId
  } satisfies Prisma.PostCreateManyInput;
}

type SeedPostsOptions = {
  authorIds: number[];
  length?: number;
};

export async function seedPosts(
  prisma: PrismaClient,
  options: SeedPostsOptions
) {
  const { authorIds, length = 25 } = options;

  const seededPosts = Array.from({ length }, () => {
    const authorId = faker.helpers.arrayElement(authorIds);
    return generatePostSeed(authorId);
  });

  await prisma.post.createMany({
    data: seededPosts
  });
}
