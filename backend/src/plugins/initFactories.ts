import { Container } from 'typedi';

import { config } from '@/config';
import { RedisManager } from '@/services/redis/RedisManager';
import { RedisClientFactory } from '@/services/factories/RedisClientFactory';

const {
    redisCache: { url: redisCacheUrl },
    cache: { isEnabled: isCacheEnabled, keyExpiresInMinutes: cacheKeyExpiresInMinutes }
} = config;

export const initFactories = async () => {
    let redisCacheClient = null;
    let redisCacheManager = null;

    const redisClientFactory = Container.get(RedisClientFactory);

    redisCacheClient = await redisClientFactory.create(redisCacheUrl);
    redisCacheManager = new RedisManager(redisCacheClient, isCacheEnabled, cacheKeyExpiresInMinutes);

    Container.set('redisCacheClient', redisCacheClient);
    Container.set('cacheManager', redisCacheManager);
};
