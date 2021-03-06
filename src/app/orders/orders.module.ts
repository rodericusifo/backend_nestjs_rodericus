import { CartsModule } from '@app/carts/carts.module';
import { FilesModule } from '@app/files/files.module';
import { OrdersController } from '@app/orders/controllers/orders.controller';
import { OrdersRepository } from '@app/orders/database/repositories/orders.repository';
import { OrdersService } from '@app/orders/services/orders.service';
import { ProductsModule } from '@app/products/products.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdersRepository]),
    CartsModule,
    ProductsModule,
    FilesModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
