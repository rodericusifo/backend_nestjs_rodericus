import { CartDTO } from '@app/carts/dto/cart.dto';
import { CartsService } from '@app/carts/service/carts.service';
import { ICartsService } from '@app/carts/service/interface/carts-service.interface';
import { FileDTO } from '@app/files/dto/file.dto';
import { FilesService } from '@app/files/service/files.service';
import { IFilesService } from '@app/files/service/interface/files-service.interface';
import { AddProductToOrderDTO } from '@app/orders/dto/add-product-to-order.dto';
import { CreateOrderDTO } from '@app/orders/dto/create-order.dto';
import { OrderDTO } from '@app/orders/dto/order.dto';
import { ReadAllOrderByAdminDTO } from '@app/orders/dto/read-all-order-by-admin.dto';
import { ReadAllOrderByCustomerDTO } from '@app/orders/dto/read-all-order-by-customer.dto';
import { ReadOrderByAdminDTO } from '@app/orders/dto/read-order-by-admin.dto';
import { ReadOrderByCustomerDTO } from '@app/orders/dto/read-order-by-customer.dto';
import { SubmitOrderPaymentProofDTO } from '@app/orders/dto/submit-order-payment-proof.dto';
import { SubmitOrderDTO } from '@app/orders/dto/submit-order.dto';
import { OrdersRepository } from '@app/orders/repository/orders.repository';
import { OrdersService } from '@app/orders/service/orders.service';
import { IProductsService } from '@app/products/service/interface/products-service.interface';
import { ProductsService } from '@app/products/service/products.service';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderStatus } from '@shared/enum/order-status.enum';
import { IReadAllServiceMethodResponse } from '@shared/interface/other/service-method-response/read-all-service-method-response.interface';
import { plainToClass } from 'class-transformer';
import { randomUUID } from 'crypto';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let ordersRepository: OrdersRepository;
  let cartsService: CartsService;
  let productsService: ProductsService;
  let filesService: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        OrdersService,
        {
          provide: CartsService,
          useValue: {
            createCart: jest.fn(),
            readAllCart: jest.fn(),
          } as ICartsService,
        },
        {
          provide: ProductsService,
          useValue: {
            createProduct: jest.fn(),
            deleteAllProduct: jest.fn(),
            readAllProduct: jest.fn(),
            readProduct: jest.fn(),
            updateProduct: jest.fn(),
          } as IProductsService,
        },
        {
          provide: FilesService,
          useValue: {
            createFile: jest.fn(),
          } as IFilesService,
        },
        {
          provide: getRepositoryToken(OrdersRepository),
          useClass: OrdersRepository,
        },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<OrdersRepository>(
      getRepositoryToken(OrdersRepository),
    );
    cartsService = module.get<CartsService>(CartsService);
    productsService = module.get<ProductsService>(ProductsService);
    filesService = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(ordersService).toBeDefined();
    expect(ordersRepository).toBeDefined();
    expect(cartsService).toBeDefined();
    expect(productsService).toBeDefined();
    expect(filesService).toBeDefined();
  });

  describe('createOrder()', () => {
    it('should successfully create order', async () => {
      const argument: CreateOrderDTO = {
        email: 'rodericus123@gmail.com',
        name: 'Rodericus Ifo',
        address: 'Hello Street',
        phoneNumber: '081233456787',
        title: 'Order 1',
        userId: randomUUID(),
      };
      const expectedResult = undefined;
      const expectedError = undefined;
      jest
        .spyOn(ordersRepository, 'saveOrder')
        .mockImplementation(() => Promise.resolve(null));
      try {
        const data = await ordersService.createOrder(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
    it('should failed create user as admin', async () => {
      const argument: CreateOrderDTO = {
        email: 'rodericus123@gmail.com',
        name: 'Rodericus Ifo',
        address: 'Hello Street',
        phoneNumber: '081233456787',
        title: 'Order 1',
        userId: randomUUID(),
      };
      const expectedResult = undefined;
      const expectedError = 'Failed Create Order';
      jest
        .spyOn(ordersRepository, 'saveOrder')
        .mockImplementation(() => Promise.reject('Failed Create Order'));
      try {
        const data = await ordersService.createOrder(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });

  describe('addProductToOrder()', () => {
    it('should successfully add product to order', async () => {
      const argument: AddProductToOrderDTO = {
        id: randomUUID(),
        productId: randomUUID(),
        userId: randomUUID(),
        quantity: 3,
      };
      const expectedResult = undefined;
      const expectedError = undefined;
      jest
        .spyOn(ordersRepository, 'findOrderWithUserId')
        .mockImplementation(() =>
          Promise.resolve(
            plainToClass(OrderDTO, { id: argument.id } as Partial<OrderDTO>),
          ),
        );
      jest
        .spyOn(cartsService, 'createCart')
        .mockImplementation(() => Promise.resolve(null));
      try {
        const data = await ordersService.addProductToOrder(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
    it('should failed add product to order', async () => {
      const argument: AddProductToOrderDTO = {
        id: randomUUID(),
        productId: randomUUID(),
        userId: randomUUID(),
        quantity: 3,
      };
      const expectedResult = undefined;
      const expectedError = 'Failed Add Product to Order';
      jest
        .spyOn(ordersRepository, 'findOrderWithUserId')
        .mockImplementation(() =>
          Promise.reject('Failed Add Product to Order'),
        );
      try {
        const data = await ordersService.addProductToOrder(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });

  describe('readOrderByAdmin()', () => {
    it('should successfully read order by admin', async () => {
      const argument: ReadOrderByAdminDTO = {
        id: randomUUID(),
      };
      const expectedResult: OrderDTO = plainToClass(OrderDTO, {
        id: argument.id,
        title: 'Order 1',
        carts: [
          plainToClass(CartDTO, {
            id: '12345',
            quantity: 2,
          } as Partial<CartDTO>),
        ],
      } as Partial<OrderDTO>);
      const expectedError = undefined;
      jest.spyOn(ordersRepository, 'findOrder').mockImplementation(() =>
        Promise.resolve(
          plainToClass(OrderDTO, {
            id: argument.id,
            title: 'Order 1',
          } as Partial<OrderDTO>),
        ),
      );
      jest.spyOn(cartsService, 'readAllCart').mockImplementation(() =>
        Promise.resolve([
          plainToClass(CartDTO, {
            id: '12345',
            quantity: 2,
          } as Partial<CartDTO>),
        ]),
      );
      try {
        const data = await ordersService.readOrderByAdmin(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
    it('should failed read order by admin', async () => {
      const argument: ReadOrderByAdminDTO = {
        id: randomUUID(),
      };
      const expectedResult = undefined;
      const expectedError = 'Failed Read Order By Admin';
      jest
        .spyOn(ordersRepository, 'findOrder')
        .mockImplementation(() => Promise.reject('Failed Read Order By Admin'));
      try {
        const data = await ordersService.readOrderByAdmin(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });

  describe('readOrderByCustomer()', () => {
    it('should successfully read order by customer', async () => {
      const argument: ReadOrderByCustomerDTO = {
        id: randomUUID(),
        userId: randomUUID(),
      };
      const expectedResult: OrderDTO = plainToClass(OrderDTO, {
        id: argument.id,
        title: 'Order 1',
        userId: argument.userId,
        carts: [
          plainToClass(CartDTO, {
            id: '12345',
            quantity: 3,
          } as Partial<CartDTO>),
        ],
      } as Partial<OrderDTO>);
      const expectedError = undefined;
      jest
        .spyOn(ordersRepository, 'findOrderWithUserId')
        .mockImplementation(() =>
          Promise.resolve(
            plainToClass(OrderDTO, {
              id: argument.id,
              title: 'Order 1',
              userId: argument.userId,
            } as Partial<OrderDTO>),
          ),
        );
      jest.spyOn(cartsService, 'readAllCart').mockImplementation(() =>
        Promise.resolve([
          plainToClass(CartDTO, {
            id: '12345',
            quantity: 3,
          } as Partial<CartDTO>),
        ]),
      );
      try {
        const data = await ordersService.readOrderByCustomer(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
    it('should failed read order by customer', async () => {
      const argument: ReadOrderByCustomerDTO = {
        id: randomUUID(),
        userId: randomUUID(),
      };
      const expectedResult = undefined;
      const expectedError = 'Failed Read Order By Customer';
      jest
        .spyOn(ordersRepository, 'findOrderWithUserId')
        .mockImplementation(() =>
          Promise.reject('Failed Read Order By Customer'),
        );
      try {
        const data = await ordersService.readOrderByCustomer(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });

  describe('readAllOrderByAdmin()', () => {
    it('should successfully read all order by admin', async () => {
      const argument: ReadAllOrderByAdminDTO = {
        limit: 5,
        page: 1,
      };
      const UUIDv1 = randomUUID();
      const UUIDv2 = randomUUID();
      const expectedResult: IReadAllServiceMethodResponse<OrderDTO[]> = {
        findAll: [
          plainToClass(OrderDTO, {
            id: UUIDv1,
            title: 'Order 1',
          } as Partial<OrderDTO>),
        ],
        findAllPagination: [
          plainToClass(OrderDTO, {
            id: UUIDv1,
            title: 'Order 2',
            carts: [
              plainToClass(CartDTO, {
                id: UUIDv2,
                quantity: 3,
              } as Partial<CartDTO>),
            ],
          } as Partial<OrderDTO>),
        ],
      };
      const expectedError = undefined;
      jest.spyOn(ordersRepository, 'findAllOrder').mockImplementation(() =>
        Promise.resolve([
          plainToClass(OrderDTO, {
            id: UUIDv1,
            title: 'Order 1',
          } as Partial<OrderDTO>),
        ]),
      );
      jest
        .spyOn(ordersRepository, 'findAllOrderPagination')
        .mockImplementation(() =>
          Promise.resolve([
            plainToClass(OrderDTO, {
              id: UUIDv1,
              title: 'Order 2',
            } as Partial<OrderDTO>),
          ]),
        );
      jest.spyOn(cartsService, 'readAllCart').mockImplementation(() =>
        Promise.resolve([
          plainToClass(CartDTO, {
            id: UUIDv2,
            quantity: 3,
          } as Partial<CartDTO>),
        ]),
      );
      try {
        const data = await ordersService.readAllOrderByAdmin(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
    it('should failed read all order by admin', async () => {
      const argument: ReadAllOrderByAdminDTO = {
        limit: 5,
        page: 1,
      };
      const expectedResult = undefined;
      const expectedError = 'Failed Read All Order By Admin';
      jest
        .spyOn(ordersRepository, 'findAllOrder')
        .mockImplementation(() =>
          Promise.reject('Failed Read All Order By Admin'),
        );
      try {
        const data = await ordersService.readAllOrderByAdmin(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });

  describe('readAllOrderByCustomer()', () => {
    it('should successfully read all order by customer', async () => {
      const argument: ReadAllOrderByCustomerDTO = {
        limit: 5,
        page: 1,
        userId: randomUUID(),
      };
      const UUIDv1 = randomUUID();
      const UUIDv2 = randomUUID();
      const expectedResult: IReadAllServiceMethodResponse<OrderDTO[]> = {
        findAll: [
          plainToClass(OrderDTO, {
            id: UUIDv1,
            title: 'Order 1',
            userId: argument.userId,
          } as Partial<OrderDTO>),
        ],
        findAllPagination: [
          plainToClass(OrderDTO, {
            id: UUIDv1,
            title: 'Order 2',
            userId: argument.userId,
            carts: [
              plainToClass(CartDTO, {
                id: UUIDv2,
                quantity: 4,
              } as Partial<CartDTO>),
            ],
          } as Partial<OrderDTO>),
        ],
      };
      const expectedError = undefined;
      jest
        .spyOn(ordersRepository, 'findAllOrderWithUserId')
        .mockImplementation(() =>
          Promise.resolve([
            plainToClass(OrderDTO, {
              id: UUIDv1,
              title: 'Order 1',
              userId: argument.userId,
            } as Partial<OrderDTO>),
          ]),
        );
      jest
        .spyOn(ordersRepository, 'findAllOrderPaginationWithUserId')
        .mockImplementation(() =>
          Promise.resolve([
            plainToClass(OrderDTO, {
              id: UUIDv1,
              title: 'Order 2',
              userId: argument.userId,
            } as Partial<OrderDTO>),
          ]),
        );
      jest.spyOn(cartsService, 'readAllCart').mockImplementation(() =>
        Promise.resolve([
          plainToClass(CartDTO, {
            id: UUIDv2,
            quantity: 4,
          } as Partial<CartDTO>),
        ]),
      );
      try {
        const data = await ordersService.readAllOrderByCustomer(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
    it('should failed read all order by customer', async () => {
      const argument: ReadAllOrderByCustomerDTO = {
        limit: 5,
        page: 1,
        userId: randomUUID(),
      };
      const expectedResult = undefined;
      const expectedError = 'Failed Read All Order By Customer';
      jest
        .spyOn(ordersRepository, 'findAllOrderWithUserId')
        .mockImplementation(() =>
          Promise.reject('Failed Read All Order By Customer'),
        );
      try {
        const data = await ordersService.readAllOrderByCustomer(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });

  describe('submitOrder()', () => {
    it('should successfully submit order', async () => {
      const argument: SubmitOrderDTO = {
        id: randomUUID(),
        userId: randomUUID(),
      };
      const expectedResult = undefined;
      const expectedError = undefined;
      jest
        .spyOn(ordersRepository, 'findOrderWithUserId')
        .mockImplementation(() =>
          Promise.resolve(
            plainToClass(OrderDTO, {
              id: argument.id,
              title: 'Order 5',
              status: OrderStatus.Draft,
              userId: argument.userId,
            } as Partial<OrderDTO>),
          ),
        );
      jest.spyOn(cartsService, 'readAllCart').mockImplementation(() =>
        Promise.resolve([
          plainToClass(CartDTO, {
            id: '54321',
            quantity: 3,
            product: {
              stock: 5,
            },
          } as Partial<CartDTO>),
        ]),
      );
      jest
        .spyOn(productsService, 'updateProduct')
        .mockImplementation(() => Promise.resolve(null));
      jest
        .spyOn(ordersRepository, 'updateOrder')
        .mockImplementation(() => Promise.resolve(null));
      try {
        const data = await ordersService.submitOrder(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
    it('should failed submit order', async () => {
      const argument: SubmitOrderDTO = {
        id: randomUUID(),
        userId: randomUUID(),
      };
      const expectedResult = undefined;
      const expectedError = 'Failed Submit Order';
      jest
        .spyOn(ordersRepository, 'findOrderWithUserId')
        .mockImplementation(() => Promise.reject('Failed Submit Order'));
      try {
        const data = await ordersService.submitOrder(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });

  describe('submitOrderPaymentProof()', () => {
    it('should successfully submit order payment proof', async () => {
      const argument: SubmitOrderPaymentProofDTO = {
        id: randomUUID(),
        mimeType: 'pdf',
        originalName: 'a.pdf',
        path: 'pdf/a.pdf',
        urlOrigin: 'http://localhost:3000',
        userId: randomUUID(),
      };
      const expectedResult = undefined;
      const expectedError = undefined;
      jest
        .spyOn(ordersRepository, 'findOrderWithUserId')
        .mockImplementation(() =>
          Promise.resolve(
            plainToClass(OrderDTO, {
              id: argument.id,
              title: 'Order 5',
              paymentProofLink: null,
              status: OrderStatus.Submitted,
              userId: argument.userId,
            } as Partial<OrderDTO>),
          ),
        );
      jest.spyOn(filesService, 'createFile').mockImplementation(() =>
        Promise.resolve(
          plainToClass(FileDTO, {
            id: randomUUID(),
            mimeType: 'pdf',
            originalName: 'a.pdf',
            path: 'pdf/a.pdf',
            userId: argument.userId,
          } as Partial<FileDTO>),
        ),
      );
      jest
        .spyOn(ordersRepository, 'updateOrder')
        .mockImplementation(() => Promise.resolve(null));
      try {
        const data = await ordersService.submitOrderPaymentProof(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
    it('should failed submit order payment proof', async () => {
      const argument: SubmitOrderPaymentProofDTO = {
        id: randomUUID(),
        mimeType: 'pdf',
        originalName: 'a.pdf',
        path: 'pdf/a.pdf',
        urlOrigin: 'http://localhost:3000',
        userId: randomUUID(),
      };
      const expectedResult = undefined;
      const expectedError = 'Failed Submit Order Payment Proof';
      jest
        .spyOn(ordersRepository, 'findOrderWithUserId')
        .mockImplementation(() =>
          Promise.reject('Failed Submit Order Payment Proof'),
        );
      try {
        const data = await ordersService.submitOrderPaymentProof(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });
});
