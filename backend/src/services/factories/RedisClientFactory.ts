import { Service } from 'typedi';
import { createClient } from 'redis';

import { Logger } from '@/services/common/Logger';

@Service()
export class RedisClientFactory {
    async create(url: string) {
        const redisClient = createClient({ url });

        await redisClient.connect();

        Logger.info('Redis client instance connected!');

        return redisClient;
    }
}
