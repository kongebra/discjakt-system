import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { RetailersModule } from './retailers/retailers.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';

@Module({
  imports: [ProductsModule, RetailersModule, ManufacturersModule],
})
export class DataModule {}
