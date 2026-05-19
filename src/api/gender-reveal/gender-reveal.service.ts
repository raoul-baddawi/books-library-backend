import { Injectable } from "@nestjs/common";

import { PrismaService } from "$/integrations/prisma/prisma.service";

import {
  CreateGenderGuessDto,
  UpdateGenderRevealSettingsDto
} from "./dto/gender-reveal.dto";
import { getS3Url } from "$/utils/misc";

@Injectable()
export class GenderRevealService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    const existing = await this.prisma.genderRevealSettings.findFirst();
    if (existing) return existing;
    return this.prisma.genderRevealSettings.create({ data: {} });
  }

  async updateSettings(dto: UpdateGenderRevealSettingsDto) {
    const settings = await this.getSettings();
    return this.prisma.genderRevealSettings.update({
      where: { id: settings.id },
      data: {
        gender: dto.gender,
        revealDate: dto.revealDate ? new Date(dto.revealDate) : dto.revealDate
      }
    });
  }

  async reveal() {
    const settings = await this.getSettings();
    return this.prisma.genderRevealSettings.update({
      where: { id: settings.id },
      data: { isRevealed: true }
    });
  }

  async getGuesses() {
    const guesses = await this.prisma.genderGuess.findMany({
      orderBy: { createdAt: "desc" }
    });

    return guesses.map((guess) => ({
      ...guess,
      mediaUrls: guess.mediaUrls.map(getS3Url)
    }));
  }

  async createGuess(dto: CreateGenderGuessDto) {
    return this.prisma.genderGuess.create({
      data: {
        name: dto.name,
        guess: dto.guess,
        mediaUrls: dto.mediaUrls
      }
    });
  }
}
