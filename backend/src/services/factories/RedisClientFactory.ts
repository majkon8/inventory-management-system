import { Service } from 'typedi';
import { createClient } from 'redis';

@Service()
export class RedisClientFactory {
    async create(url: string) {
        const redisClient = createClient({ url });

        await redisClient.connect();

        console.info('Redis client instance connected!');

        return redisClient;
    }
}
