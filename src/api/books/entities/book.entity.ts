import { fullNameReturner, getS3Url } from "$/utils/misc";
import type { Prisma } from "$prisma/index";

export function bookTransformer(
  book: Prisma.BookGetPayload<{
    include: {
      author: true;
    };
  }>
) {
  const {
    id,
    name,
    description,
    media,
    isPublished,
    author,
    genre,
    authorId,
    publishedAt
  } = book;
  const authorName = fullNameReturner(author.firstName, author.lastName);
  return {
    id,
    name,
    authorId: authorId.toString(),
    authorName,
    description,
    isPublished,
    publishedAt,
    genre,
    media: media.map(getS3Url)
  };
}

export function adminBookTransformer(
  book: Prisma.BookGetPayload<{
    include: {
      author: true;
    };
  }>
) {
  const {
    id,
    name,
    description,
    media,
    isPublished,
    author,
    authorId,
    publishedAt,
    genre,
    createdAt
  } = book;
  const authorName = fullNameReturner(author.firstName, author.lastName);

  return {
    id,
    name,
    authorId,
    authorName,
    description:
      description.slice(0, 100) + (description.length > 100 ? "..." : ""),
    isPublished,
    publishedAt,
    createdAt,
    genre,
    media: media.map(getS3Url)
  };
}
