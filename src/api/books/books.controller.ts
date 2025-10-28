import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import { BooksService } from "./books.service";
import { CreateBookDto, FindBooksDto, UpdateBookDto } from "./dto/book.dto";
import { AllowedRoles, AuthUser, Public } from "../auth/decorators";
import { User, UserRoleEnum } from "$prisma/client";
import { TransformResponse } from "$/core/decorators/transform.decorators";
import { bookTransformer } from "./entities/book.entity";
import { ApiConsumes } from "@nestjs/swagger";

@Controller("books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @Public()
  @TransformResponse(bookTransformer)
  async getBooks(@Query() filter: FindBooksDto) {
    return this.booksService.getBooks(filter);
  }

  @Get(":id")
  @Public()
  @TransformResponse(bookTransformer)
  async getBookById(@Param("id", ParseIntPipe) id: number) {
    return this.booksService.getBookById(id);
  }

  @Post()
  @ApiConsumes("application/x-www-form-urlencoded")
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.AUTHOR)
  async createBook(
    @AuthUser() user: User,
    @Body() createBookDto: CreateBookDto
  ) {
    return this.booksService.createBook(user.id, createBookDto);
  }

  @Patch(":id")
  @ApiConsumes("application/x-www-form-urlencoded")
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.AUTHOR)
  async updateBook(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto
  ) {
    return this.booksService.updateBook(id, updateBookDto);
  }

  @Delete(":id")
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.AUTHOR)
  async deleteBook(@Param("id", ParseIntPipe) id: number) {
    return this.booksService.deleteBook(id);
  }
}
