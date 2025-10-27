import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { SentryGlobalFilter, SentryModule } from "@sentry/nestjs/setup";

import { UsersModule } from "./api/users/users.module";
import { AppController } from "./app.controller";
import { envSchema } from "./config/config.schema";
import { validateConfig } from "./config/config.utils";
import { PrismaModule } from "./integrations/prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // ignoreEnvFile: process.env.NODE_ENV === "production",
      load: [
        () => {
          if (process.env.NODE_ENV === "production") {
            // In production, we might want to load from a secure vault or similar
            return {};
          }
          return {};
        }
      ],
      validate: (config) => validateConfig(envSchema, config)
    }),
    SentryModule.forRoot(),
    PrismaModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter
    }
  ]
})
export class AppModule {}
