import type { ExecutionContext } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common";

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return request.user;
  }
);
