import mongoose from 'mongoose';
import { Response } from 'express';
import { Inject, Service } from 'typedi';
import { StatusCodes } from 'http-status-codes';

import { RedisManager } from '@/services/redis/RedisManager';
import { OrderRepository } from '@/repositories/OrderRepository';
import { ProductRepository } from '@/repositories/ProductRepository';

import type { ICacheRedis } from '@/types/redis';
import type { IStoreRequest } from '@/types/order';

@Service()
export class StoreController {
    constructor(
        @Inject('cacheManager')
        private readonly cacheManager: RedisManager<ICacheRedis>,
        private readonly productRepository: ProductRepository,
        private readonly orderRepository: OrderRepository
    ) {}

    async invoke(request: IStoreRequest, response: Response) {
        const {
            body: { customerId, products }
        } = request;

        const productIds = products.map(product => product.id);

        const foundProducts = await this.productRepository.findAll({
            _id: { $in: productIds }
        });

        if (!foundProducts.length) {
            return response.sendStatus(StatusCodes.NOT_FOUND);
        }

        if (foundProducts.length !== products.length) {
            return response.status(StatusCodes.NOT_FOUND).send("Some of your selected products don't exist!");
        }

        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            for (const product of products) {
                const foundProduct = foundProducts.find(_product => _product.id === product.id);

                if (!foundProduct) {
                    return response
                        .status(StatusCodes.BAD_REQUEST)
                        .send(`Product with ID ${product.id} doesn't exist!`);
                }

                if (product.quantity > foundProduct.stock) {
                    return response
                        .status(StatusCodes.BAD_REQUEST)
                        .send(`Your selected quantity of product with ID ${product.id} is greater than its stock!`);
                }

                foundProduct.stock = Math.max(0, foundProduct.stock - product.quantity);

                await foundProduct.save({ session });
            }

            await this.orderRepository.create({ customerId, products });

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();

            const errorMessage =
                error instanceof Error
                    ? `Something went wrong: ${error.message}`
                    : 'Something went wrong: Unknown error';

            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorMessage);
        } finally {
            session.endSession();
        }

        await Promise.all([this.cacheManager.forgetByPattern(`products:index`)]);

        return response.sendStatus(StatusCodes.CREATED);
    }
}
