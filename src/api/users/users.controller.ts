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
import { ApiConsumes } from "@nestjs/swagger";

import { User, UserRoleEnum } from "$prisma/index";

import { AllowedRoles, AuthUser, Public } from "../auth/decorators";
import { CreateUserDto } from "./dto/create-user.dto";
import { FindUsersDto } from "./dto/find-users.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("select-options")
  @Public()
  async getAuthorsSelectOptions(
    @Query("isValidAuthors") isValidAuthors: string | undefined
  ) {
    const isValid = JSON.parse(isValidAuthors || "false") as boolean;
    return this.usersService.getAuthorsSelectOptions(isValid);
  }

  @AllowedRoles(UserRoleEnum.ADMIN)
  @Post("get-all")
  findAll(@AuthUser() user: User, @Body() filter: FindUsersDto) {
    return this.usersService.findAll(user.id, filter);
  }

  @Public()
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @AllowedRoles(UserRoleEnum.ADMIN)
  @ApiConsumes("application/x-www-form-urlencoded")
  @Post()
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @AllowedRoles(UserRoleEnum.ADMIN)
  @ApiConsumes("application/x-www-form-urlencoded")
  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateUserDto) {
    return this.usersService.update(id, data);
  }

  @AllowedRoles(UserRoleEnum.ADMIN)
  @Delete("delete/:id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
