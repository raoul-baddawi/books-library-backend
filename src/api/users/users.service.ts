import crypto from "node:crypto";

import { Injectable } from "@nestjs/common";

import { PrismaService } from "$/integrations/prisma/prisma.service";
import { Prisma } from "$prisma/client";

import { CreateUserDto } from "./dto/create-user.dto";
import { FindUsersDto } from "./dto/find-users.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { createDateFilter } from "$/utils/date/range-date.builder";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filter: FindUsersDto) {
    const searchQuery = filter.search?.split(" ").flatMap((searchTerm) => {
      return [
        {
          firstName: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          lastName: {
            contains: searchTerm,
            mode: "insensitive"
          }
        }
      ] satisfies Prisma.UserWhereInput[];
    });
    const createdAt = createDateFilter(filter.dateRange);
    return this.prisma.user.findMany({
      where: {
        OR: searchQuery,
        createdAt
      },
      skip: filter.offset,
      take: filter.limit
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id }
    });
  }

  async create(data: CreateUserDto) {
    await this.prisma.user.create({
      data
    });
  }

  async update(id: number, data: UpdateUserDto) {
    await this.prisma.user.update({
      where: { id },
      data
    });
  }

  async delete(id: number) {
    await this.prisma.user.delete({
      where: { id }
    });
  }
}
