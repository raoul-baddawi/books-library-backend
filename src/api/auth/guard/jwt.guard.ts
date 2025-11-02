import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

import { IS_PUBLIC_KEY } from "../decorators";

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (user !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return user;
    }
    if (isPublic) {
      return true;
    }
    throw new UnauthorizedException("Unauthorized");
  }
}
