import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { sdk } from './tracing';

async function bootstrap() {
  sdk.start();

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('DiscJakt API')
    .setDescription('')
    .setVersion('1.0')
    .addTag('disc')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

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
