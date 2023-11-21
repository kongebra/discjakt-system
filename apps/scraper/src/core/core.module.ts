import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { TracerService } from './tracer/tracer.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { OpenTelemetryModule } from 'nestjs-otel';

@Module({
  imports: [
    OpenTelemetryModule.forRoot({
      metrics: {
        hostMetrics: true, // Includes Host Metrics
        apiMetrics: {
          enable: true, // Includes api metrics
          defaultAttributes: {
            // You can set default labels for api metrics
            custom: 'label',
          },
          ignoreRoutes: ['/favicon.ico'], // You can ignore specific routes (See https://docs.nestjs.com/middleware#excluding-routes for options)
          ignoreUndefinedRoutes: false, //Records metrics for all URLs, even undefined ones
        },
      },
    }),
    HttpModule,
    ConfigModule.forRoot(),
  ],
  providers: [PrismaService, TracerService],
  exports: [PrismaService, TracerService, HttpModule],
})
export class CoreModule {}
