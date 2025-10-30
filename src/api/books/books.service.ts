import { BadRequestException, Injectable } from "@nestjs/common";

import { PrismaService } from "$/integrations/prisma/prisma.service";
import { createDateFilter } from "$/utils/date/range-date.builder";

import { CreateBookDto, FindBooksDto } from "./dto/book.dto";

@Injectable()
export class BooksService {
  constructor(private readonly db: PrismaService) {}

  async getBooks(filters: FindBooksDto) {
    const { search, dateRange, limit, page, genre } = filters;
    const offset = page && limit ? (page - 1) * limit : 0;
    return this.db.book.findMany({
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

  async getBooksGenreFilterOptions() {
    const genres = await this.db.book.findMany({
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
    return this.db.book.findUnique({
      where: { id }
    });
  }

  async createBook(userId: number, data: CreateBookDto) {
    const user = await this.db.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      throw new BadRequestException("User not found");
    }
    return this.db.book.create({
      data: {
        ...data,
        authorId: userId
      }
    });
  }

  async updateBook(id: number, data: Partial<CreateBookDto>) {
    return this.db.book.update({
      where: { id },
      data
    });
  }

  async deleteBook(id: number) {
    return this.db.book.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
