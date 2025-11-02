import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon from "argon2";

import { PrismaService } from "$/integrations/prisma/prisma.service";
import { User } from "$prisma/client";

import { LoginUserDto, RegisterUserDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  private async signToken(user: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }): Promise<string | undefined> {
    const payload = {
      sub: user.id,
      email: `${user.email}`
    };
    if (!user) return;
    return this.jwtService.signAsync(payload, {
      expiresIn: "1y",
      secret: this.config.get("JWT_SECRET")
    });
  }

  private async findUserAndThrowIfSo(
    email: string,
    password: string,
    confirmPassword: string
  ) {
    const user = await this.db.user.findUnique({
      where: {
        email
      }
    });

    if (user) {
      throw new HttpException("User already exists", HttpStatus.NOT_FOUND);
    }
    if (password !== confirmPassword) {
      throw new HttpException("Passwords do not match", HttpStatus.BAD_REQUEST);
    }
  }

  async login(data: LoginUserDto) {
    const user = await this.db.user.findFirst({
      where: {
        email: { equals: data.email, mode: "insensitive" }
      }
    });

    if (!user) {
      throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
    }

    const verified = await argon.verify(user.password, data.password);
    if (!verified) {
      throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST);
    }

    return this.signToken(user);
  }

  async register(data: RegisterUserDto) {
    const { email, password, confirmPassword, firstName, lastName } = data;

    await this.findUserAndThrowIfSo(email, password, confirmPassword);
    const hashedPassword = await argon.hash(password);

    const createdUser = await this.db.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName
      }
    });
    return this.signToken(createdUser);
  }

  async getMyUserData(user: User) {
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    const userData = await this.db.user.findUnique({
      where: {
        id: user.id
      },
      omit: {
        password: true,
        updatedAt: true
      }
    });

    if (!userData) {
      throw new UnauthorizedException("User not found");
    }

    return userData;
  }
}
