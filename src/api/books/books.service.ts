import { PrismaService } from "$/integrations/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateBookDto, FindBooksDto } from "./dto/book.dto";
import { createDateFilter } from "$/utils/date/range-date.builder";

@Injectable()
export class BooksService {
  constructor(private readonly db: PrismaService) {}

  async getBooks(filters: FindBooksDto) {
    const { search, dateRange, limit, offset } = filters;
    return this.db.book.findMany({
      where: {
        name: search ? { contains: search, mode: "insensitive" } : undefined,
        createdAt: createDateFilter(dateRange),
        deletedAt: null
      },
      take: limit,
      skip: offset
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
