import { AuthModule } from '@app/auth/auth.module';
import { CartsModule } from '@app/carts/carts.module';
import { FilesModule } from '@app/files/files.module';
import { OrdersModule } from '@app/orders/orders.module';
import { ProductsModule } from '@app/products/products.module';
import { SeedsModule } from '@app/seeds/seeds.module';
import { UsersModule } from '@app/users/users.module';
import Configuration from '@config/configuration';
import { LoggerModule } from '@logger/logger.module';
import { LoggerService } from '@logger/logger.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseModule } from '@response/response.module';
import { StrategyModule } from '@shared/modules/strategy.module';
import { WinstonModule } from 'nest-winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Configuration],
      ignoreEnvFile: true,
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('db.postgres.host'),
        port: +configService.get<number>('db.postgres.port'),
        username: configService.get('db.postgres.username'),
        password: configService.get('db.postgres.password'),
        database: configService.get('db.postgres.name'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    WinstonModule.forRootAsync({
      inject: [LoggerService],
      imports: [LoggerModule],
      useFactory: (loggerFileService: LoggerService) =>
        loggerFileService.createLogger(),
    }),
    StrategyModule,
    LoggerModule,
    ResponseModule,
    ProductsModule,
    SeedsModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    CartsModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
