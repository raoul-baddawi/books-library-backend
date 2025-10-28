import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
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
      throw new HttpException("Non autorisé", HttpStatus.UNAUTHORIZED);
    }
    const { password, ...rest } = user;
    return rest;
  }
}
