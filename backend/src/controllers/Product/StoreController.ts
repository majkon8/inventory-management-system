import { Response } from 'express';
import { Inject, Service } from 'typedi';
import { StatusCodes } from 'http-status-codes';

import { RedisManager } from '@/services/redis/RedisManager';
import { ProductRepository } from '@/repositories/ProductRepository';

import type { ICacheRedis } from '@/types/redis';
import type { IStoreRequest } from '@/types/product';

@Service()
export class StoreController {
    constructor(
        @Inject('cacheManager')
        private readonly cacheManager: RedisManager<ICacheRedis>,
        private readonly productRepository: ProductRepository
    ) {}

    async invoke(request: IStoreRequest, response: Response) {
        const {
            body: { name, description, price, stock }
        } = request;

        const createdProduct = await this.productRepository.create({ name, description, price, stock });

        await Promise.all([this.cacheManager.forgetByPattern(`products:index`)]);

        return response.status(StatusCodes.CREATED).send(createdProduct);
    }
}
