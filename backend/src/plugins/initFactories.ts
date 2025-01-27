import { Container } from 'typedi';

import { config } from '@/config';
import { RedisManager } from '@/services/redis/RedisManager';
import { MongooseFactory } from '@/services/factories/MongooseFactory';
import { RedisClientFactory } from '@/services/factories/RedisClientFactory';

const {
    redisCache: { url: redisCacheUrl },
    cache: { isEnabled: isCacheEnabled, keyExpiresInMinutes: cacheKeyExpiresInMinutes },
    mongo: { url: mongoUrl }
} = config;

export const initFactories = async () => {
    let redisCacheClient = null;
    let redisCacheManager = null;
    let mongoose = null;

    const mongooseFactory = Container.get(MongooseFactory);
    mongoose = await mongooseFactory.create(mongoUrl);

    const redisClientFactory = Container.get(RedisClientFactory);
    redisCacheClient = await redisClientFactory.create(redisCacheUrl);
    redisCacheManager = new RedisManager(redisCacheClient, isCacheEnabled, cacheKeyExpiresInMinutes);

    Container.set('redisCacheClient', redisCacheClient);
    Container.set('cacheManager', redisCacheManager);
    Container.set('mongoose', mongoose);
};
