import { fullNameReturner, getS3Url } from "$/utils/misc";
import { Prisma } from "$prisma/index";

export function bookTransformer(
  book: Prisma.BookGetPayload<{
    include: {
      author: true;
    };
  }>
) {
  const { id, name, description, media, isPublished, author, authorId } = book;
  const authorName = fullNameReturner(author.firstName, author.lastName);
  return {
    id,
    name,
    authorId,
    authorName,
    description,
    isPublished,
    media: media.map(getS3Url)
  };
}
