import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

import { PrismaService } from "$/integrations/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly db: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          if (request.cookies && "token" in request.cookies) {
            return request.cookies.token;
          }
          return null;
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get("JWT_SECRET")!
    });
  }

  async validate(payload: { sub: number; fullName: string } | null) {
    if (payload == null) {
      return null;
    }
    const user = await this.db.user.findUnique({
      where: {
        id: payload.sub
      }
    });
    if (user == null) {
      throw new UnauthorizedException("Unauthorized");
    }
    const { password, ...rest } = user;
    return rest;
  }
}
