import { HoneycombSDK } from '@honeycombio/opentelemetry-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PrismaInstrumentation } from '@prisma/instrumentation';

// uses the HONEYCOMB_API_KEY and OTEL_SERVICE_NAME environment variables
const sdk = new HoneycombSDK({
  serviceName: 'discjakt_scraper',
  instrumentations: [
    getNodeAutoInstrumentations({
      // we recommend disabling fs autoinstrumentation since it can be noisy
      // and expensive during startup
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
    }),
    new PrismaInstrumentation(),
  ],
});

export { sdk };
