import { Inject, Service } from 'typedi';

import { RedisManager } from '@/services/redis/RedisManager';
import { ProductWriteRepository } from '@/repositories/ProductWriteRepository';

import type { IProductWrite } from '@/types/mongo';
import type { ICacheRedis } from '@/types/redis';

@Service()
export class ProductCommandService {
    constructor(
        @Inject('cacheManager')
        private readonly cacheManager: RedisManager<ICacheRedis>,
        private readonly productWriteRepository: ProductWriteRepository
    ) {}

    async createProduct(data: Partial<IProductWrite>) {
        const createdProduct = await this.productWriteRepository.create(data);

        await this.cacheManager.forgetByPattern(`products:index`);

        return createdProduct;
    }

    async restockProduct(productId: string, quantity: number): Promise<boolean> {
        const { matchedCount } = await this.productWriteRepository.updateOne(
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
        const { matchedCount } = await this.productWriteRepository.updateOne({ _id: productId }, [
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
