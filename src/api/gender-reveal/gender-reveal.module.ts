import { Module } from "@nestjs/common";

import { GenderRevealController } from "./gender-reveal.controller";
import { GenderRevealService } from "./gender-reveal.service";

@Module({
  controllers: [GenderRevealController],
  providers: [GenderRevealService]
})
export class GenderRevealModule {}
