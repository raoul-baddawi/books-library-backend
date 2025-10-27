
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";

import { AppModule } from "./app.module";
import type { EnvSchema } from "./config/config.schema";
import { CustomZodValidationPipe } from "./core/pipes/validation.pipe";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // if we don't cast the ConfigService, it will not infer the types correctly
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const configService = app.get(ConfigService) as ConfigService<
    EnvSchema,
    true
  >;

  // enable extended query parsing for express version 11 and above
  app.set("query parser", "extended");
  app.enableVersioning();
  app.useGlobalPipes(new CustomZodValidationPipe());

  await app.listen(configService.get("PORT", { infer: true }));
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
