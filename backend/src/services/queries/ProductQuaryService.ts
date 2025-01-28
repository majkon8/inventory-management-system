import { Inject, Service } from 'typedi';

import { RedisManager } from '@/services/redis/RedisManager';
import { ProductReadRepository } from '@/repositories/ProductReadRepository';

import type { ICacheRedis } from '@/types/redis';
import type { ProductReadDocument } from '@/types/mongo';

@Service()
export class ProductQueryService {
    constructor(
        @Inject('cacheManager')
        private readonly cacheManager: RedisManager<ICacheRedis>,
        private readonly productReadRepository: ProductReadRepository
    ) {}

    async getAllProducts(): Promise<ProductReadDocument[]> {
        const cacheKey = `products:index`;

        if (await this.cacheManager.exists(cacheKey)) {
            return this.cacheManager.get(cacheKey);
        }

        const products = await this.productReadRepository.findAll();

        await this.cacheManager.set(cacheKey, products);

        return products;
    }

    async findProductsById(productIds: string[]): Promise<ProductReadDocument[]> {
        const products = await this.productReadRepository.findAll({
            _id: { $in: productIds }
        });

        return products;
    }
}
