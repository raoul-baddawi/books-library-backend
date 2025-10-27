import type { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EnvSchema } from "$/config/config.schema";
import { Prisma, PrismaClient } from "$prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, "query">
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService<EnvSchema, true>) {
    const isProduction =
      configService.get("NODE_ENV", { infer: true }) === "production";

    super({
      log: [
        { emit: "event", level: "query" },
        { emit: "stdout", level: "info" },
        { emit: "stdout", level: "warn" },
        { emit: "stdout", level: "error" }
      ],
      errorFormat: isProduction ? "minimal" : "pretty"
    });
    // uncomment the following block if you want to log queries in development
    // if (envService.isDevelopment) {
    //   this.$on("query", (event) => {
    //     Logger.debug(
    //       `${event.query}\n${event.params} - ${event.duration}ms`,
    //       PrismaService.name
    //     );
    //   });
    // }
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      Logger.error(error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
