import { Container } from 'typedi';

import { config } from '@/config';
import { RedisManager } from '@/services/redis/RedisManager';
import { MongooseFactory } from '@/services/factories/MongooseFactory';
import { RedisClientFactory } from '@/services/factories/RedisClientFactory';

const {
    redisCache: { url: redisCacheUrl },
    cache: { isEnabled: isCacheEnabled, keyExpiresInMinutes: cacheKeyExpiresInMinutes },
    mongo: { writeUrl, readUrl }
} = config;

export const initFactories = async () => {
    let redisCacheClient = null;
    let redisCacheManager = null;
    let mongooseWrite = null;
    let mongooseRead = null;

    const mongooseFactory = Container.get(MongooseFactory);
    mongooseWrite = await mongooseFactory.create(writeUrl, false);
    mongooseRead = await mongooseFactory.create(readUrl, true);

    const redisClientFactory = Container.get(RedisClientFactory);
    redisCacheClient = await redisClientFactory.create(redisCacheUrl);
    redisCacheManager = new RedisManager(redisCacheClient, isCacheEnabled, cacheKeyExpiresInMinutes);

    Container.set('redisCacheClient', redisCacheClient);
    Container.set('cacheManager', redisCacheManager);
    Container.set('mongooseWrite', mongooseWrite);
    Container.set('mongooseRead', mongooseRead);
};
