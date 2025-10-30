import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import { JwtGuard } from "./api/auth/guard";
import { AppModule } from "./app.module";
import type { EnvSchema } from "./config/config.schema";
import { CustomZodValidationPipe } from "./core/pipes/validation.pipe";
import { CORS_CONFIG } from "./utils/constants/config.constants";

async function bootstrap() {
  // I could use fastify instead of express for a real production application
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

  app.enableCors(CORS_CONFIG);
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.useGlobalPipes(new CustomZodValidationPipe());
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtGuard(reflector));

  const config = new DocumentBuilder()
    .setTitle("BOOKS LIBRARY API")
    .setDescription("Books library api swagger UI")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(configService.get("PORT", { infer: true }));
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
