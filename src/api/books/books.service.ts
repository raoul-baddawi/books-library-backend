import { BadRequestException, Injectable } from "@nestjs/common";

import { PrismaService } from "$/integrations/prisma/prisma.service";
import { createDateFilter } from "$/utils/date/range-date.builder";
import { Prisma, User } from "$prisma/index";

import { CreateBookDto, FindAdminBooksDto, FindBooksDto } from "./dto/book.dto";
import { adminBookTransformer } from "./entities/book.entity";

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async getBooks(filters: FindBooksDto) {
    const { search, dateRange, limit, page, genre } = filters;
    const offset = page && limit ? (page - 1) * limit : 0;
    return this.prisma.book.findMany({
      where: {
        OR: search
          ? [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } }
            ]
          : undefined,
        createdAt: createDateFilter(dateRange),
        deletedAt: null,
        genre: genre ? { in: genre } : undefined
      },
      include: {
        author: true
      },
      take: limit,
      skip: offset
    });
  }

  async findAdminBooks(data: FindAdminBooksDto) {
    const { pagination, sorting, filters } = data;
    const { dateRange, search, genre, author } = filters || {};
    const { offset, limit } = pagination || {};
    const { key, order } = sorting || {};
    const searchQuery = search?.split(" ").flatMap((searchTerm) => {
      return [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive"
          }
        }
      ] satisfies Prisma.BookWhereInput[];
    });
    const createdAt = createDateFilter(dateRange);
    const where: Prisma.BookWhereInput = {
      OR: searchQuery,
      genre: genre && genre.length ? { in: genre } : undefined,
      authorId:
        author && author.length ? { in: author.map(Number) } : undefined,
      createdAt,
      deletedAt: null
    };
    const books = await this.prisma.book.findMany({
      where,
      include: {
        author: true
      },
      skip: offset && limit ? offset * limit : 0,
      take: limit,
      orderBy: key
        ? {
            [key]: order || "desc"
          }
        : {
            createdAt: "desc"
          }
    });

    const count = await this.prisma.book.count({
      where
    });

    return {
      data: books.map(adminBookTransformer),
      count
    };
  }

  async getBooksGenreFilterOptions() {
    const genres = await this.prisma.book.findMany({
      where: {
        deletedAt: null
      },
      select: {
        genre: true
      },
      distinct: ["genre"]
    });
    return genres.map((g) => {
      return {
        label: g.genre,
        value: g.genre
      };
    });
  }

  async getBookById(id: number) {
    return this.prisma.book.findUnique({
      where: { id },
      include: {
        author: true
      }
    });
  }

  async createBook(user: User, data: CreateBookDto) {
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.role === "AUTHOR" ? user.id : data.authorId }
    });
    if (!dbUser) {
      throw new BadRequestException("Author not found");
    }
    return this.prisma.book.create({
      data: {
        ...data,
        authorId: dbUser.id
      }
    });
  }

  async updateBook(
    id: number,
    user: User,
    { authorId, ...data }: Partial<CreateBookDto>
  ) {
    const findBook = await this.prisma.book.findUnique({
      where: { id }
    });
    if (!findBook) {
      throw new BadRequestException("Book not found");
    }

    if (user.role === "AUTHOR" && findBook.authorId !== user.id) {
      throw new BadRequestException("You are not allowed to update this book");
    }

    return this.prisma.book.update({
      where: { id },
      data: {
        ...data,
        authorId: user.role === "AUTHOR" ? user.id : authorId
      }
    });
  }

  async deleteBook(id: number) {
    return this.prisma.book.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
