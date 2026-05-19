import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const genderSchema = z.enum(["BOY", "GIRL"]);

export const updateGenderRevealSettingsSchema = z.strictObject({
  gender: genderSchema.nullable().optional(),
  revealDate: z.string().nullable().optional()
});

export const createGenderGuessSchema = z.strictObject({
  name: z.string().trim().min(1),
  guess: genderSchema,
  mediaUrls: z.array(z.string()).default([])
});

export class UpdateGenderRevealSettingsDto extends createZodDto(
  updateGenderRevealSettingsSchema
) {}
export class CreateGenderGuessDto extends createZodDto(
  createGenderGuessSchema
) {}
