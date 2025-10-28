import { faker } from "@faker-js/faker/locale/fr";

import type { Prisma, PrismaClient } from "$prisma/client";

function generateBookSeed(authorId: number) {
  const isPublished = faker.datatype.boolean();
  const publishedAt = isPublished ? faker.date.past() : null;

  return {
    name: faker.lorem.sentence({ min: 3, max: 7 }),
    description: faker.lorem.paragraphs({ min: 2, max: 5 }),
    media: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
      faker.image.urlLoremFlickr({ category: "books" })
    ),
    isPublished,
    publishedAt,
    authorId
  } satisfies Prisma.BookCreateManyInput;
}

type SeedBooksOptions = {
  authorIds: number[];
  length?: number;
};

export async function seedBooks(
  prisma: PrismaClient,
  options: SeedBooksOptions
) {
  const { authorIds, length = 25 } = options;

  const seededBooks = Array.from({ length }, () => {
    const authorId = faker.helpers.arrayElement(authorIds);
    return generateBookSeed(authorId);
  });

  await prisma.book.createMany({
    data: seededBooks
  });
}
