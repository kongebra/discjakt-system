import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'database';
import { TracerService } from '../tracer/tracer.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly _: TracerService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }
}
