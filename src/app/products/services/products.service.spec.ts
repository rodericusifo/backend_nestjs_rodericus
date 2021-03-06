import { ProductsRepository } from '@app/products/database/repositories/products.repository';
import { CreateProductDTO } from '@app/products/dto/create-product.dto';
import { ProductDTO } from '@app/products/dto/product.dto';
import { ReadAllProductDTO } from '@app/products/dto/read-all-product.dto';
import { ReadProductDTO } from '@app/products/dto/read-product.dto';
import { UpdateProductDTO } from '@app/products/dto/update-product.dto';
import { ProductsService } from '@app/products/services/products.service';
import { MockedProductsRepository } from '@app/products/__mocks__/repository/mock-products.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IReadAllServiceMethodResponse } from '@shared/interfaces/other/service-method-response/read-all-service-method-response.interface';
import { plainToInstance } from 'class-transformer';
import { randomUUID } from 'crypto';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productsRepository: MockedProductsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(ProductsRepository),
          useClass: MockedProductsRepository,
        },
      ],
    }).compile();

    productsService = module.get(ProductsService);
    productsRepository = module.get(getRepositoryToken(ProductsRepository));
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
    expect(productsRepository).toBeDefined();
  });

  describe('createProduct()', () => {
    it('should successfully create a product', async () => {
      const argument: CreateProductDTO = {
        name: 'Apple',
        price: 100,
        stock: 0,
        description: '',
      };
      const expectedResult = undefined;
      const expectedError = undefined;
      jest
        .spyOn(productsRepository, 'saveProduct')
        .mockImplementation(() => Promise.resolve(null));
      try {
        const data = await productsService.createProduct(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
    it('should failed create a product', async () => {
      const argument: CreateProductDTO = {
        name: 'Apple',
        price: 100,
        stock: 0,
        description: '',
      };
      const expectedResult = undefined;
      const expectedError = 'Failed Create Product';
      jest
        .spyOn(productsRepository, 'saveProduct')
        .mockImplementation(() => Promise.reject('Failed Create Product'));
      try {
        const data = await productsService.createProduct(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });

  describe('readAllProduct()', () => {
    it('should successfully read all product', async () => {
      const argument: ReadAllProductDTO = {
        limit: 5,
        page: 1,
      };
      const UUIDv1 = randomUUID();
      const UUIDv2 = randomUUID();
      const expectedResult: IReadAllServiceMethodResponse<ProductDTO[]> = {
        findAll: [
          plainToInstance(ProductDTO, {
            id: UUIDv1,
            name: 'Hello',
            price: 200,
          } as ProductDTO),
        ],
        findAllPagination: [
          plainToInstance(ProductDTO, {
            id: UUIDv2,
            name: 'Hello',
            price: 200,
          } as ProductDTO),
        ],
      };
      const expectedError = undefined;
      jest.spyOn(productsRepository, 'findAllProduct').mockImplementation(() =>
        Promise.resolve([
          plainToInstance(ProductDTO, {
            id: UUIDv1,
            name: 'Hello',
            price: 200,
          } as ProductDTO),
        ] as ProductDTO[]),
      );
      jest
        .spyOn(productsRepository, 'findAllProductPagination')
        .mockImplementation(() =>
          Promise.resolve([
            plainToInstance(ProductDTO, {
              id: UUIDv2,
              name: 'Hello',
              price: 200,
            } as ProductDTO),
          ] as ProductDTO[]),
        );
      try {
        const data = await productsService.readAllProduct(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
    it('should failed read all product', async () => {
      const argument: ReadAllProductDTO = {
        limit: 5,
        page: 1,
      };
      const expectedResult = undefined;
      const expectedError = 'Failed Read All Product';
      jest
        .spyOn(productsRepository, 'findAllProduct')
        .mockImplementation(() => Promise.reject('Failed Read All Product'));
      jest
        .spyOn(productsRepository, 'findAllProductPagination')
        .mockImplementation(() => Promise.reject('Failed Read All Product'));
      try {
        const data = await productsService.readAllProduct(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });

  describe('readProduct()', () => {
    it('should successfully read product', async () => {
      const argument: ReadProductDTO = {
        id: randomUUID(),
      };
      const expectedResult: ProductDTO = plainToInstance(ProductDTO, {
        id: argument.id,
        name: 'Hello',
        price: 200,
      } as ProductDTO);
      const expectedError = undefined;
      jest.spyOn(productsRepository, 'findProduct').mockImplementation(() =>
        Promise.resolve(
          plainToInstance(ProductDTO, {
            id: argument.id,
            name: 'Hello',
            price: 200,
          } as ProductDTO),
        ),
      );
      try {
        const data = await productsService.readProduct(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
    it('should failed read all product', async () => {
      const argument: ReadProductDTO = {
        id: randomUUID(),
      };
      const expectedResult = undefined;
      const expectedError = 'Failed Read Product';
      jest
        .spyOn(productsRepository, 'findProduct')
        .mockImplementation(() => Promise.reject('Failed Read Product'));
      try {
        const data = await productsService.readProduct(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });

  describe('updateProduct()', () => {
    it('should successfully update a product', async () => {
      const argument: UpdateProductDTO = {
        id: randomUUID(),
        name: 'Apple',
        price: 100,
        stock: 0,
        description: '',
      };
      const expectedResult = undefined;
      const expectedError = undefined;
      jest
        .spyOn(productsRepository, 'updateProduct')
        .mockImplementation(() => Promise.resolve(null));
      try {
        const data = await productsService.updateProduct(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
    it('should failed update a product', async () => {
      const argument: UpdateProductDTO = {
        id: randomUUID(),
        name: 'Apple',
        price: 100,
        stock: 0,
        description: '',
      };
      const expectedResult = undefined;
      const expectedError = 'Failed Update Product';
      jest
        .spyOn(productsRepository, 'updateProduct')
        .mockImplementation(() => Promise.reject('Failed Update Product'));
      try {
        const data = await productsService.updateProduct(argument);
        expect(data).toEqual(expectedResult);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });
});
