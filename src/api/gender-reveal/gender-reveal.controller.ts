import { Body, Controller, Get, Patch, Post } from "@nestjs/common";

import { AllowedRoles, Public } from "../auth/decorators";
import { UserRoleEnum } from "$prisma/client";
import {
  CreateGenderGuessDto,
  UpdateGenderRevealSettingsDto
} from "./dto/gender-reveal.dto";
import { GenderRevealService } from "./gender-reveal.service";

@Controller("gender-reveal")
export class GenderRevealController {
  constructor(private readonly genderRevealService: GenderRevealService) {}

  @Get("settings")
  @Public()
  getSettings() {
    return this.genderRevealService.getSettings();
  }

  @Patch("settings")
  @AllowedRoles(UserRoleEnum.ADMIN)
  updateSettings(@Body() dto: UpdateGenderRevealSettingsDto) {
    return this.genderRevealService.updateSettings(dto);
  }

  @Post("reveal")
  @AllowedRoles(UserRoleEnum.ADMIN)
  reveal() {
    return this.genderRevealService.reveal();
  }

  @Get("guesses")
  @Public()
  getGuesses() {
    return this.genderRevealService.getGuesses();
  }

  @Post("guess")
  @Public()
  createGuess(@Body() dto: CreateGenderGuessDto) {
    return this.genderRevealService.createGuess(dto);
  }
}
