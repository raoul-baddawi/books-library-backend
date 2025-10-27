import z from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .optional()
    .default("development"),
  PORT: z.coerce.number().int(),
  DATABASE_URL: z.url(),
});

export type EnvSchema = z.infer<typeof envSchema>;
