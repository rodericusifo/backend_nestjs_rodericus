import { CartsModule } from '@app/carts/carts.module';
import { OrdersController } from '@app/orders/controller/orders.controller';
import { OrdersRepository } from '@app/orders/repository/orders.repository';
import { OrdersService } from '@app/orders/service/orders.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OrdersRepository]), CartsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
