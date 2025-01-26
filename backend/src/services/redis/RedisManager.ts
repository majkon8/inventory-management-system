import type { RedisScripts, RedisModules, RedisFunctions, RedisClientType } from 'redis';

export class RedisManager<IRedis extends Record<string, unknown>> {
    constructor(
        private readonly redis: RedisClientType<RedisModules, RedisFunctions, RedisScripts>,
        private readonly isEnabled = true,
        private readonly keyExpiresInMinutes = 0
    ) {}

    async get<T extends keyof IRedis>(key: T | null = null) {
        if (!key || !this.isEnabled) {
            return null;
        }

        const result = await this.redis.get(key as string);

        if (!result) {
            return null;
        }

        return JSON.parse(result) as IRedis[T];
    }

    async set<T extends keyof IRedis>(key: T, value: IRedis[T], expiresInMinutes = this.keyExpiresInMinutes) {
        if (!this.isEnabled) {
            return;
        }

        const jsonValue = JSON.stringify(value);

        if (expiresInMinutes) {
            await this.redis.setEx(key as string, expiresInMinutes * 60, jsonValue);
        } else {
            await this.redis.set(key as string, jsonValue);
        }
    }

    async exists(key: string): Promise<boolean> {
        if (!this.isEnabled) {
            return new Promise(resolve => resolve(false));
        }

        const exists = await this.redis.exists(key);

        return !!exists;
    }
}
