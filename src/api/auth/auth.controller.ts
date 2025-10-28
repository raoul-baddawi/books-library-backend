import { Controller, Body, Post, Get, Res } from "@nestjs/common";
import { ApiTags, ApiConsumes } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginUserDto, RegisterUserDto } from "./dto";
import { AuthUser, Public } from "./decorators";
import { Response } from "express";
import { User } from "$prisma/client";
import { responseTokenCookie } from "$/utils/misc";
import { TransformResponse } from "$/core/decorators/transform.decorators";
import { userTransformer } from "../users/entities/user.entity";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("me")
  @TransformResponse(userTransformer)
  getMe(@AuthUser() user: User) {
    return this.authService.getMyUserData(user);
  }

  @Post("login")
  @Public()
  @ApiConsumes("application/x-www-form-urlencoded")
  async loginWeb(
    @Body()
    body: LoginUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = await this.authService.login(body);
    responseTokenCookie(res, token);
  }

  @Post("register")
  @Public()
  @ApiConsumes("application/x-www-form-urlencoded")
  async register(
    @Body() body: RegisterUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = await this.authService.register(body);
    responseTokenCookie(res, token);
  }

  @Post("logout")
  async logout(
    @Res({ passthrough: true }) res: Response,
    @AuthUser() user: User
  ) {
    // For now this function is not that much usefull, but it is here in case we need to implement server side logout logic in the future
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true
    });

    return {
      message: `User ${user.email} logged out successfully`
    };
  }
}
