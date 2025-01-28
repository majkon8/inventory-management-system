import { createClient } from 'redis';

import { config } from '@/config';

const {
    redisCache: { url: redisUrl }
} = config;

export const clear = async () => {
    console.log('Clear cache script has started.');

    const redisClient = createClient({ url: redisUrl });

    await redisClient.connect();

    await redisClient.flushAll();

    console.log('Cache has been cleared.');

    await redisClient.disconnect();

    console.log('Clear cache script has finished.');
};
