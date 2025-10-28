import type { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export const CORS_CONFIG = {
  credentials: true,
  origin: JSON.parse(process.env.ALLOWED_ORIGINS || "[]"),
  exposedHeaders: ["Set-Cookie"],
  allowedHeaders: ["Content-Type", "Authorization", "responseType"]
} satisfies CorsOptions;
