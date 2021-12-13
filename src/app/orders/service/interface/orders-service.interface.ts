import { AddProductToOrderDTO } from '@app/orders/dto/add-product-to-order.dto';
import { CreateOrderDTO } from '@app/orders/dto/create-order.dto';
import { OrderDTO } from '@app/orders/dto/order.dto';
import { ReadAllOrderByAdminDTO } from '@app/orders/dto/read-all-order-by-admin.dto';
import { ReadOrderByAdminDTO } from '@app/orders/dto/read-order-by-admin.dto';
import { ReadOrderByCustomerDTO } from '@app/orders/dto/read-order-by-customer.dto';
import { IReadAllServiceMethodResponse } from '@shared/interface/other/service-method-response/read-all-service-method-response.interface';

export interface IOrdersService {
  createOrder(payload: CreateOrderDTO);
  readAllOrderByAdmin(
    payload: ReadAllOrderByAdminDTO,
  ): Promise<IReadAllServiceMethodResponse<OrderDTO[]>>;
  readOrderByAdmin(payload: ReadOrderByAdminDTO): Promise<OrderDTO>;
  readOrderByCustomer(payload: ReadOrderByCustomerDTO): Promise<OrderDTO>;
  addProductToOrder(payload: AddProductToOrderDTO);
}
