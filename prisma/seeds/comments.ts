import { faker } from "@faker-js/faker/locale/fr";

import type { Prisma, PrismaClient } from "$prisma/client";

function generateCommentSeed(postId: number, authorId: number) {
  return {
    content: faker.lorem.words(),
    postId,
    authorId
  } satisfies Prisma.CommentCreateManyInput;
}

type SeedCommentsOptions = {
  postIds: number[];
  authorIds: number[];
  length?: number;
};

export async function seedComments(
  prisma: PrismaClient,
  options: SeedCommentsOptions
) {
  const { postIds, authorIds, length = 50 } = options;

  const seededComments = Array.from({ length }, () => {
    const postId = faker.helpers.arrayElement(postIds);
    const authorId = faker.helpers.arrayElement(authorIds);
    return generateCommentSeed(postId, authorId);
  });

  await prisma.comment.createMany({
    data: seededComments
  });
}
