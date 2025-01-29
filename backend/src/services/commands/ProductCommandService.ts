import { Inject, Service } from 'typedi';

import { model, action } from '@/enums/syncData';
import { Publisher } from '@/services/queues/Publisher';
import { RedisManager } from '@/services/redis/RedisManager';
import { ProductWriteRepository } from '@/repositories/ProductWriteRepository';
import { SyncDataConsumer } from '@/services/queues/consumers/SyncDataConsumer';

import type { ICacheRedis } from '@/types/redis';
import type { IProductWrite } from '@/types/mongo';

@Service()
export class ProductCommandService {
    constructor(
        @Inject('cacheManager')
        private readonly cacheManager: RedisManager<ICacheRedis>,
        @Inject('syncDataPublisher')
        private readonly syncDataPublisher: Publisher,
        private readonly productWriteRepository: ProductWriteRepository
    ) {}

    async createProduct(data: Partial<IProductWrite>) {
        const createdProduct = await this.productWriteRepository.create(data);

        this.syncDataPublisher.publish<SyncDataConsumer>({
            modelName: model.Product,
            actionName: action.Created,
            data: createdProduct
        });

        await this.cacheManager.forgetByPattern(`products:index`);

        return createdProduct;
    }

    async restockProduct(productId: string, quantity: number): Promise<boolean> {
        const updatedProduct = await this.productWriteRepository.findOneAndUpdate(
            { _id: productId },
            {
                $inc: { stock: quantity }
            },
            { new: true }
        );

        if (!updatedProduct) {
            return false;
        }

        this.syncDataPublisher.publish<SyncDataConsumer>({
            modelName: model.Product,
            actionName: action.Updated,
            data: updatedProduct
        });

        await this.cacheManager.forgetByPattern(`products:index`);

        return true;
    }

    async sellProduct(productId: string, quantity: number): Promise<boolean> {
        const updatedProduct = await this.productWriteRepository.findOneAndUpdate(
            { _id: productId },
            [
                {
                    $set: {
                        stock: {
                            $cond: {
                                if: { $gte: [{ $subtract: ['$stock', quantity] }, 0] },
                                then: { $subtract: ['$stock', quantity] },
                                else: 0
                            }
                        }
                    }
                }
            ],
            { new: true }
        );

        if (!updatedProduct) {
            return false;
        }

        this.syncDataPublisher.publish<SyncDataConsumer>({
            modelName: model.Product,
            actionName: action.Updated,
            data: updatedProduct
        });

        await this.cacheManager.forgetByPattern(`products:index`);

        return true;
    }
}
