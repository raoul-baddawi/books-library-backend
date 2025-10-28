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

import { TransformResponse } from "$/core/decorators/transform.decorators";

import { CreateUserDto } from "./dto/create-user.dto";
import { FindUsersDto } from "./dto/find-users.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { userTransformer } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { AllowedRoles, Public } from "../auth/decorators";
import { UserRoleEnum } from "$prisma/index";
import { ApiConsumes } from "@nestjs/swagger";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @TransformResponse(userTransformer)
  @Get()
  findAll(@Query() filter: FindUsersDto) {
    return this.usersService.findAll(filter);
  }

  @Public()
  @TransformResponse(userTransformer)
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
  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
