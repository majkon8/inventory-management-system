import { Inject, Service } from 'typedi';

import { RedisManager } from '@/services/redis/RedisManager';
import { ProductRepository } from '@/repositories/ProductRepository';

import type { ProductDocument } from '@/types/mongo';
import type { ICacheRedis } from '@/types/redis';

@Service()
export class ProductQueryService {
    constructor(
        @Inject('cacheManager')
        private readonly cacheManager: RedisManager<ICacheRedis>,
        private readonly productRepository: ProductRepository
    ) {}

    async getAllProducts(): Promise<ProductDocument[]> {
        const cacheKey = `products:index`;

        if (await this.cacheManager.exists(cacheKey)) {
            return this.cacheManager.get(cacheKey);
        }

        const products = await this.productRepository.findAll();

        await this.cacheManager.set(cacheKey, products);

        return products;
    }

    async findProductsById(productIds: string[]): Promise<ProductDocument[]> {
        const products = await this.productRepository.findAll({
            _id: { $in: productIds }
        });

        return products;
    }
}
