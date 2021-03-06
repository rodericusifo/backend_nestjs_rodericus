import { ProductsController } from '@app/products/controllers/products.controller';
import { ProductsRepository } from '@app/products/database/repositories/products.repository';
import { ProductsService } from '@app/products/services/products.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsRepository])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
