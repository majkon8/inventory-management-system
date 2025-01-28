import colors from 'colors';
import { config as dotenvConfig } from 'dotenv';

import type { IConfig } from '@/types/config';

dotenvConfig({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const env = (key: string, defaultValue = '') => process.env[key] || defaultValue;

const isEnabled = (key: string) => env(key) === 'true';

const parseUrl = (url: string) => (url.endsWith('/') ? url.slice(0, -1) : url);

const TEST_ENVIRONMENTS = ['test'];
const DEV_ENVIRONMENTS = ['dev', 'development'];
const AVAILABLE_ENVIRONMENTS = [...TEST_ENVIRONMENTS, ...DEV_ENVIRONMENTS];

const currentEnvironment = env('NODE_ENV');

if (!AVAILABLE_ENVIRONMENTS.includes(currentEnvironment)) {
    console.warn(colors.yellow(`NODE_ENV is incorrect. Should be one of: ${AVAILABLE_ENVIRONMENTS.join(', ')}.`));
}

export const config: IConfig = {
    app: {
        env: currentEnvironment,
        isDev: DEV_ENVIRONMENTS.includes(currentEnvironment),
        isTest: TEST_ENVIRONMENTS.includes(currentEnvironment),
        port: parseInt(env('PORT', '3000')),
        url: parseUrl(env('APP_URL', 'http://127.0.0.1:3000')),
        corsSites: env('CORS_SITES')
    },
    redisCache: {
        url: `redis://:${env('REDIS_CACHE_PASS')}@${env('REDIS_CACHE_HOST')}:${env('REDIS_CACHE_PORT')}`,
        host: env('REDIS_CACHE_HOST'),
        port: parseInt(env('REDIS_CACHE_PORT')),
        password: env('REDIS_CACHE_PASS'),
        ttl: env('REDIS_CACHE_TTL')
    },
    cache: {
        isEnabled: isEnabled('CACHE_ENABLED'),
        keyExpiresInMinutes: parseInt(env('CACHE_KEY_EXPIRES_IN_MINUTES'))
    },
    mongo: {
        writeUrl: `mongodb://${env('MONGO_USERNAME')}:${env('MONGO_PASSWORD')}@${env('MONGO_WRITE_HOST')}:${env(
            'MONGO_WRITE_PORT'
        )}/${env('MONGO_DATABASE')}?authSource=admin&directConnection=true`,
        readUrl: `mongodb://${env('MONGO_USERNAME')}:${env('MONGO_PASSWORD')}@${env('MONGO_READ_HOST')}:${env(
            'MONGO_READ_PORT'
        )}/${env('MONGO_DATABASE')}?authSource=admin&directConnection=true`,
        username: env('MONGO_USERNAME'),
        password: env('MONGO_PASSWORD'),
        database: env('MONGO_DATABASE'),
        writeHost: env('MONGO_WRITE_HOST'),
        writePort: parseInt(env('MONGO_WRITE_PORT')),
        readHost: env('MONGO_READ_HOST'),
        readPort: parseInt(env('MONGO_READ_PORT'))
    }
};
