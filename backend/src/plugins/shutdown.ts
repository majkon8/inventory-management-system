import { Container } from 'typedi';

import type { RedisScripts, RedisModules, RedisFunctions, RedisClientType } from 'redis';

export const shutdown = async (killProcess = false, status = 0) => {
    if (Container.has('redisCacheClient')) {
        try {
            console.info('Shutting down cache Redis connection...');

            const redisCacheClient: RedisClientType<RedisModules, RedisFunctions, RedisScripts> =
                Container.get('redisCacheClient');
            await redisCacheClient.disconnect();

            console.info('Cache Redis connection closed!');
        } catch {
            console.error('There was an error during shutting down redis cache connection!');
        }
    }

    if (killProcess) {
        process.exit(status);
    }
};
