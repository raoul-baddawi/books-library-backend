import type { DotenvParseOutput } from "dotenv";
import { config } from "dotenv";
import type { z } from "zod";

export function validateConfig<const Schema extends z.ZodObject>(
  configSchema: Schema,
  configObject: Record<string, unknown>
) {
  const result = configSchema.safeParse(configObject);

  if (!result.success) {
    throw new Error(
      `Environment validation failed: ${result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ")}`
    );
  }

  return result.data;
}

export function loadConfig<
  const Schema extends z.ZodObject,
  const WithValidation extends boolean = true
>(
  configSchema: Schema,
  withValidation: WithValidation = true as WithValidation
): WithValidation extends true
  ? z.infer<typeof configSchema>
  : DotenvParseOutput {
  type Return = WithValidation extends true
    ? z.infer<typeof configSchema>
    : DotenvParseOutput;

  if (process.env.NODE_ENV === "production") {
    // in production, we might want to load from a secure vault or similar
    const dotEnvConfig = config();
    if (dotEnvConfig.error) {
      console.error("Failed to load .env file:", dotEnvConfig.error);
      throw new Error("Failed to load .env file");
    }

    if (withValidation) {
      const validatedConfig = validateConfig(
        configSchema,
        dotEnvConfig.parsed || {}
      );
      return validatedConfig as Return;
    }

    return dotEnvConfig.parsed as Return;
  }

  const dotEnvConfig = config();
  if (dotEnvConfig.error) {
    console.error("Failed to load .env file:", dotEnvConfig.error);
    throw new Error("Failed to load .env file");
  }

  if (withValidation) {
    const validatedConfig = validateConfig(
      configSchema,
      dotEnvConfig.parsed || {}
    );
    return validatedConfig as Return;
  }

  return dotEnvConfig.parsed as Return;
}
