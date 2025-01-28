import { Inject, Service } from 'typedi';

import { RedisManager } from '@/services/redis/RedisManager';
import { ProductRepository } from '@/repositories/ProductRepository';

import type { IProduct } from '@/types/mongo';
import type { ICacheRedis } from '@/types/redis';

@Service()
export class ProductCommandService {
    constructor(
        @Inject('cacheManager')
        private readonly cacheManager: RedisManager<ICacheRedis>,
        private readonly productRepository: ProductRepository
    ) {}

    async createProduct(data: Partial<IProduct>) {
        const createdProduct = await this.productRepository.create(data);

        await this.cacheManager.forgetByPattern(`products:index`);

        return createdProduct;
    }

    async restockProduct(productId: string, quantity: number): Promise<boolean> {
        const { matchedCount } = await this.productRepository.updateOne(
            { _id: productId },
            { $inc: { stock: quantity } }
        );

        if (matchedCount === 0) {
            return false;
        }

        await this.cacheManager.forgetByPattern(`products:index`);

        return true;
    }

    async sellProduct(productId: string, quantity: number): Promise<boolean> {
        const { matchedCount } = await this.productRepository.updateOne({ _id: productId }, [
            {
                $set: {
                    stock: {
                        $max: [{ $add: ['$stock', -quantity] }, 0]
                    }
                }
            }
        ]);

        if (matchedCount === 0) {
            return false;
        }

        await this.cacheManager.forgetByPattern(`products:index`);

        return true;
    }
}
