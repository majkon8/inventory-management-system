import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';

import { RedisManager } from '@/services/redis/RedisManager';
import { ProductRepository } from '@/repositories/ProductRepository';

import type { ICacheRedis } from '@/types/redis';

@Service()
export class IndexController {
    constructor(
        @Inject('cacheManager')
        private readonly cacheManager: RedisManager<ICacheRedis>,
        private readonly productRepository: ProductRepository
    ) {}

    async invoke(request: Request, response: Response) {
        const cacheKey = `products:index`;

        if (await this.cacheManager.exists(cacheKey)) {
            const products = await this.cacheManager.get(cacheKey);

            return response.send(products);
        }

        const products = await this.productRepository.findAll();

        await this.cacheManager.set(cacheKey, products);

        return response.send(products);
    }
}
