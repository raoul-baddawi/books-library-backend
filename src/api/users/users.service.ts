import { Injectable } from "@nestjs/common";

import { PrismaService } from "$/integrations/prisma/prisma.service";
import { createDateFilter } from "$/utils/date/range-date.builder";
import { Prisma } from "$prisma/client";

import { CreateUserDto } from "./dto/create-user.dto";
import { FindUsersDto } from "./dto/find-users.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { userTransformer } from "./entities/user.entity";
import * as argon from "argon2";
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number, filter: FindUsersDto) {
    const { pagination, sorting, filters } = filter;
    const { dateRange, role, search } = filters || {};
    const { offset, limit } = pagination || {};
    const { key, order } = sorting || {};
    const searchQuery = search?.split(" ").flatMap((searchTerm) => {
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
    const createdAt = createDateFilter(dateRange);

    const users = await this.prisma.user.findMany({
      where: {
        OR: searchQuery,
        role: role || undefined,
        createdAt,
        id: { not: userId }
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

    const count = await this.prisma.user.count({
      where: {
        OR: searchQuery,
        role: role || undefined,
        createdAt
      }
    });

    return {
      data: users.map((user) => userTransformer(user)),
      count
    };
  }

  findOne(id: number) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        lastName: true,
        firstName: true,
        email: true,
        role: true,
        id: true
      }
    });
  }

  async create(data: CreateUserDto) {
    const hashedPassword = await argon.hash(data.password);
    await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      }
    });
  }

  async update(id: number, data: UpdateUserDto) {
    await this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        ...(data.password && {
          password: await argon.hash(data.password)
        })
      }
    });
  }

  async delete(id: number) {
    return await this.prisma.user.delete({
      where: { id }
    });
  }

  async getAuthorsSelectOptions() {
    const authors = await this.prisma.user.findMany({
      where: {
        role: "AUTHOR"
      },
      select: {
        id: true,
        firstName: true,
        lastName: true
      }
    });
    return authors.map((author) => ({
      label: `${author.firstName} ${author.lastName}`,
      value: author.id.toString()
    }));
  }
}
