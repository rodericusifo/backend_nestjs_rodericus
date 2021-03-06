import { AddProductCustomerOrderBodyRequest } from '@app/orders/controllers/request/body/add-product-customer-order-body.request';
import { CreateCustomerOrderBodyRequest } from '@app/orders/controllers/request/body/create-customer-order-body.request';
import { SubmitOrderPaymentProofByCustomerFileRequest } from '@app/orders/controllers/request/file/submit-order-payment-proof-by-customer-file.request';
import { AddProductCustomerOrderParamRequest } from '@app/orders/controllers/request/param/add-product-customer-order-param.request';
import { DetailOrderByAdminParamRequest } from '@app/orders/controllers/request/param/detail-order-by-admin-param.request';
import { DetailOrderByCustomerParamRequest } from '@app/orders/controllers/request/param/detail-order-by-customer-param.request';
import { SubmitOrderByCustomerParamRequest } from '@app/orders/controllers/request/param/submit-order-by-customer-param.request';
import { SubmitOrderPaymentProofByCustomerParamRequest } from '@app/orders/controllers/request/param/submit-order-payment-proof-by-customer-param.request';
import { ListOrderByAdminQueryRequest } from '@app/orders/controllers/request/query/list-order-by-admin-query.request';
import { ListOrderByCustomerQueryRequest } from '@app/orders/controllers/request/query/list-order-by-customer-query.request';
import { OrdersService } from '@app/orders/services/orders.service';
import { MulterConfiguration } from '@config/multer.configuration';
import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response, ResponseStatusCode } from '@response/response.decorator';
import { IResponse, IResponsePaging } from '@response/response.interface';
import { ResponseService } from '@response/response.service';
import { Auth } from '@shared/decorators/auth.decorator';
import { User } from '@shared/decorators/user.decorator';
import { Role } from '@shared/enums/role.enum';
import { IHeaders } from '@shared/interfaces/other/headers.interface';
import { UserRequest } from '@shared/request/user/user.request';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    @Response() private readonly responseService: ResponseService,
    private readonly ordersService: OrdersService,
  ) {}

  @ResponseStatusCode()
  @Auth(Role.Customer)
  @Post('/create/customer')
  async createCustomerOrder(
    @User() user: UserRequest,
    @Body() body: CreateCustomerOrderBodyRequest,
  ): Promise<IResponse> {
    await this.ordersService.createOrder({ ...body, userId: user.id });
    return this.responseService.success('Successfully Create Order');
  }

  @ResponseStatusCode()
  @Auth(Role.Customer)
  @Post(':id/add-product/customer')
  async addProductCustomerOrder(
    @User() user: UserRequest,
    @Param() param: AddProductCustomerOrderParamRequest,
    @Body() body: AddProductCustomerOrderBodyRequest,
  ): Promise<IResponse> {
    await this.ordersService.addProductToOrder({
      ...param,
      ...body,
      userId: user.id,
    });
    return this.responseService.success('Successfully Add Product To Order');
  }

  @ResponseStatusCode()
  @Auth(Role.Customer)
  @Get('/list/customer')
  async listOrderByCustomer(
    @User() user: UserRequest,
    @Query() query: ListOrderByCustomerQueryRequest,
  ): Promise<IResponsePaging> {
    const result = await this.ordersService.readAllOrderByCustomer({
      ...query,
      userId: user.id,
    });
    return this.responseService.paging(
      'All Order Found',
      result.findAll.length,
      Math.ceil(result.findAll.length / query.limit),
      query.page,
      result.findAllPagination.length,
      result.findAllPagination,
    );
  }

  @ResponseStatusCode()
  @Auth(Role.Customer)
  @Get(':id/detail/customer')
  async detailOrderByCustomer(
    @User() user: UserRequest,
    @Param() param: DetailOrderByCustomerParamRequest,
  ): Promise<IResponse> {
    const result = await this.ordersService.readOrderByCustomer({
      ...param,
      userId: user.id,
    });
    return this.responseService.success('Order Found', result);
  }

  @ResponseStatusCode()
  @Auth(Role.Customer)
  @Put(':id/submit/customer')
  async submitOrderByCustomer(
    @User() user: UserRequest,
    @Param() param: SubmitOrderByCustomerParamRequest,
  ): Promise<IResponse> {
    await this.ordersService.submitOrder({
      ...param,
      userId: user.id,
    });
    return this.responseService.success('Submit Order Success');
  }

  @ResponseStatusCode()
  @Auth(Role.Customer)
  @UseInterceptors(
    FileInterceptor('file', MulterConfiguration.uploadPaymentProofConfig()),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: SubmitOrderPaymentProofByCustomerFileRequest,
  })
  @Put(':id/submit-payment-proof/customer')
  async submitOrderPaymentProofByCustomer(
    @User() user: UserRequest,
    @Param() param: SubmitOrderPaymentProofByCustomerParamRequest,
    @UploadedFile() file: Express.Multer.File,
    @Headers() headers: IHeaders,
  ): Promise<IResponse> {
    await this.ordersService.submitOrderPaymentProof({
      ...param,
      mimeType: file.mimetype,
      originalName: file.originalname,
      path: file.path,
      urlOrigin: headers.origin,
      userId: user.id,
    });
    return this.responseService.success('Submit Payment Proof Order Success');
  }

  @ResponseStatusCode()
  @Auth(Role.Admin)
  @Get('/list/admin')
  async listOrderByAdmin(
    @Query() query: ListOrderByAdminQueryRequest,
  ): Promise<IResponsePaging> {
    const result = await this.ordersService.readAllOrderByAdmin({
      ...query,
    });
    return this.responseService.paging(
      'All Order Found',
      result.findAll.length,
      Math.ceil(result.findAll.length / query.limit),
      query.page,
      result.findAllPagination.length,
      result.findAllPagination,
    );
  }

  @ResponseStatusCode()
  @Auth(Role.Admin)
  @Get(':id/detail/admin')
  async detailOrderByAdmin(
    @Param() param: DetailOrderByAdminParamRequest,
  ): Promise<IResponse> {
    const result = await this.ordersService.readOrderByAdmin({
      ...param,
    });
    return this.responseService.success('Order Found', result);
  }
}
