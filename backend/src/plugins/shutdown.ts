import { Container } from 'typedi';
import { Connection as MongooseConnection } from 'mongoose';

import { Logger } from '@/services/common/Logger';

import type { RedisScripts, RedisModules, RedisFunctions, RedisClientType } from 'redis';

export const shutdown = async (killProcess = false, status = 0) => {
    if (Container.has('redisCacheClient')) {
        try {
            Logger.info('Shutting down cache Redis connection...');

            const redisCacheClient: RedisClientType<RedisModules, RedisFunctions, RedisScripts> =
                Container.get('redisCacheClient');
            await redisCacheClient.disconnect();

            Logger.info('Cache Redis connection closed!');
        } catch {
            console.error('There was an error during shutting down redis cache connection!');
        }
    }

    if (Container.has('mongoose')) {
        try {
            Logger.info('Shutting down MongoDB connection...');

            const mongooseWrite: MongooseConnection = Container.get('mongooseWrite');
            const mongooseRead: MongooseConnection = Container.get('mongooseRead');

            await mongooseWrite.destroy();
            await mongooseRead.destroy();

            Logger.info('MongoDB connection closed!');
        } catch {
            console.error('There was an error during shutting down mongoose connection!');
        }
    }

    if (killProcess) {
        process.exit(status);
    }
};
