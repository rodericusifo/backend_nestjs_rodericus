import { CartDTO } from '@app/carts/dto/cart.dto';
import { BadGatewayException } from '@nestjs/common';
import { OrderStatus } from '@shared/enum/order-status.enum';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInstance,
  IsMobilePhone,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class OrderDTO {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  paymentProofLink?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsMobilePhone()
  phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsArray()
  @IsInstance(CartDTO, { each: true })
  carts?: CartDTO[];

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsDateString()
  createdAt?: Date;

  @IsOptional()
  @IsDateString()
  updatedAt?: Date;

  @IsOptional()
  @IsDateString()
  deletedAt?: Date;

  changeOrderStatus(status: OrderStatus) {
    this.status = status;
  }

  setPaymentProofLink(link: string) {
    this.paymentProofLink = link;
  }

  checkStatusEqualWith(status: OrderStatus) {
    if (this.status !== status) {
      throw new BadGatewayException(
        'You Need Submit This Order First before upload payment proof',
      );
    }
  }
}
