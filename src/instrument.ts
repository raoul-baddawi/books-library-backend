import * as Sentry from "@sentry/nestjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

import { envSchema } from "./config/config.schema";
import { loadConfig } from "./config/config.utils";

function instrument() {
  const config = loadConfig(envSchema, true);

  Sentry.init({
    dsn: config.SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    environment: config.NODE_ENV
  });
}

instrument();
