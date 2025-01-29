import { Inject, Service } from 'typedi';
import { StatusCodes } from 'http-status-codes';
import { Connection as MongooseConnection } from 'mongoose';

import { RedisManager } from '@/services/redis/RedisManager';
import { ProductQueryService } from '../queries/ProductQuaryService';
import { OrderWriteRepository } from '@/repositories/OrderWriteRepository';

import type { IOrderData } from '@/types/order';
import type { ICacheRedis } from '@/types/redis';

@Service()
export class OrderCommandService {
    constructor(
        @Inject('cacheManager')
        private readonly cacheManager: RedisManager<ICacheRedis>,
        @Inject('mongooseRead')
        private readonly mongoose: MongooseConnection,
        private readonly productQueryService: ProductQueryService,
        private readonly orderWriteRepository: OrderWriteRepository
    ) {}

    async placeOrder(data: IOrderData): Promise<{ status: number; message?: string }> {
        const { customerId, products } = data;

        const productIds = products.map(product => product.id);

        const foundProducts = await this.productQueryService.findProductsById(productIds);

        if (!foundProducts.length) {
            return { status: StatusCodes.NOT_FOUND, message: 'No products found' };
        }

        if (foundProducts.length !== products.length) {
            return { status: StatusCodes.NOT_FOUND, message: "Some of your selected products don't exist!" };
        }

        const session = await this.mongoose.startSession();

        try {
            session.startTransaction();

            for (const product of products) {
                const foundProduct = foundProducts.find(_product => _product.id === product.id);

                if (!foundProduct) {
                    return { status: StatusCodes.BAD_REQUEST, message: `Product with ID ${product.id} doesn't exist!` };
                }

                if (product.quantity > foundProduct.stock) {
                    return {
                        status: StatusCodes.BAD_REQUEST,
                        message: `Your selected quantity of product with ID ${product.id} is greater than its stock!`
                    };
                }

                foundProduct.stock = Math.max(0, foundProduct.stock - product.quantity);

                await foundProduct.save({ session });
            }

            await this.orderWriteRepository.create({ customerId, products });

            await session.commitTransaction();

            await this.cacheManager.forgetByPattern(`products:index`);

            return { status: StatusCodes.CREATED };
        } catch (error) {
            await session.abortTransaction();

            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: error instanceof Error ? error.message : 'Unknown error'
            };
        } finally {
            session.endSession();
        }
    }
}
