import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { UsersModule } from "./api/users/users.module";
import { AppController } from "./app.controller";
import { envSchema } from "./config/config.schema";
import { validateConfig } from "./config/config.utils";
import { PrismaModule } from "./integrations/prisma/prisma.module";
import { BooksModule } from "./api/books/books.module";

@Module({
  imports: [
    // Sentry integration can be added  on real production application
    // SentryModule.forRoot(),

    ThrottlerModule.forRoot([
      {
        limit: 300, // 100 requests per
        ttl: 3000 // 3 seconds
      }
    ]),
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
    PrismaModule,
    UsersModule,
    BooksModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
    // I would also add SentryGlobalFilter on real production application
    // {
    //   provide: APP_FILTER,
    //   useClass: SentryGlobalFilter
    // }
  ]
})
export class AppModule {}
