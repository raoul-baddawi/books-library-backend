import { BadRequestException } from "@nestjs/common";
import { createZodValidationPipe, type ZodValidationPipe } from "nestjs-zod";
import z, { ZodError } from "zod";

export const CustomZodValidationPipe = createZodValidationPipe({
  createValidationException: (error) => {
    const ctx = error instanceof ZodError ? z.prettifyError(error) : undefined;

    return new BadRequestException({
      code: "invalid_payload",
      message: "Payload validation failed",
      ctx
    });
  }
}) as unknown as typeof ZodValidationPipe;
