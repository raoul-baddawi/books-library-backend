import type { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
const allowedOrigins = JSON.parse(
  process.env.ALLOWED_ORIGINS || "[]"
) as string[];

export const CORS_CONFIG = {
  credentials: true,
  origin: allowedOrigins,
  exposedHeaders: ["Set-Cookie"],
  allowedHeaders: ["Content-Type", "Authorization", "responseType"]
} satisfies CorsOptions;
