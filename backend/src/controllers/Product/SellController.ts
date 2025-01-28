import { Response } from 'express';
import { Inject, Service } from 'typedi';
import { StatusCodes } from 'http-status-codes';

import { RedisManager } from '@/services/redis/RedisManager';
import { ProductRepository } from '@/repositories/ProductRepository';

import type { ICacheRedis } from '@/types/redis';
import type { IRestockAndSellRequest } from '@/types/product';

@Service()
export class SellController {
    constructor(
        @Inject('cacheManager')
        private readonly cacheManager: RedisManager<ICacheRedis>,
        private readonly productRepository: ProductRepository
    ) {}

    async invoke(request: IRestockAndSellRequest, response: Response) {
        const {
            params: { id },
            body: { quantity }
        } = request;

        const { matchedCount } = await this.productRepository.updateOne({ _id: id }, [
            {
                $set: {
                    stock: {
                        $max: [{ $add: ['$stock', -quantity] }, 0]
                    }
                }
            }
        ]);

        if (matchedCount === 0) {
            return response.sendStatus(StatusCodes.NOT_FOUND);
        }

        await this.cacheManager.forgetByPattern(`products:index`);

        return response.sendStatus(StatusCodes.NO_CONTENT);
    }
}
