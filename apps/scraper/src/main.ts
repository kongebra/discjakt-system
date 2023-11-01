import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { sdk } from './tracing';

async function bootstrap() {
  sdk.start();

  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT || 8080);
}
bootstrap();

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
