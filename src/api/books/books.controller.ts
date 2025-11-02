import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import { ApiConsumes } from "@nestjs/swagger";

import { TransformResponse } from "$/core/decorators/transform.decorators";
import { User, UserRoleEnum } from "$prisma/client";

import { AllowedRoles, AuthUser, Public } from "../auth/decorators";
import { BooksService } from "./books.service";
import {
  CreateBookDto,
  FindAdminBooksDto,
  FindBooksDto,
  UpdateBookDto
} from "./dto/book.dto";
import { bookTransformer } from "./entities/book.entity";

@Controller("books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @Public()
  @TransformResponse(bookTransformer)
  async getBooks(@Query() filter: FindBooksDto) {
    return this.booksService.getBooks(filter);
  }

  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.AUTHOR)
  @Post("get-all")
  findAll(@Body() filter: FindAdminBooksDto) {
    return this.booksService.findAdminBooks(filter);
  }

  @Get("genre-options")
  @Public()
  async getBooksFilterOptions() {
    return this.booksService.getBooksGenreFilterOptions();
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
    return this.booksService.createBook(user, createBookDto);
  }

  @Patch(":id")
  @ApiConsumes("application/x-www-form-urlencoded")
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.AUTHOR)
  async updateBook(
    @Param("id", ParseIntPipe) id: number,
    @AuthUser() user: User,
    @Body() updateBookDto: UpdateBookDto
  ) {
    return this.booksService.updateBook(id, user, updateBookDto);
  }

  @Post("delete/:id")
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.AUTHOR)
  async deleteBook(@Param("id", ParseIntPipe) id: number) {
    return this.booksService.deleteBook(id);
  }
}
