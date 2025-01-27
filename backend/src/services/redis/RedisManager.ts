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

    async forget(key: keyof IRedis) {
        if (!this.isEnabled) {
            return;
        }

        await this.redis.del(key as string);
    }

    async exists(key: string): Promise<boolean> {
        if (!this.isEnabled) {
            return new Promise(resolve => resolve(false));
        }

        const exists = await this.redis.exists(key);

        return !!exists;
    }

    async eachScan(pattern: string) {
        const keys: Array<keyof IRedis> = [];
        let cursor = 0;

        do {
            const { cursor: newCursor, keys: matchingKeys } = await this.redis.scan(cursor, { MATCH: pattern });

            cursor = newCursor;
            keys.push(...matchingKeys);
        } while (cursor != 0);

        return keys;
    }

    async runActionOnKeyPattern(pattern: string, callback: (matchingKeys: Array<keyof IRedis>) => Promise<void>) {
        const keys = await this.eachScan(pattern);

        await callback(keys);
    }

    forgetByPattern(pattern: string) {
        if (!this.isEnabled) {
            return;
        }

        return this.runActionOnKeyPattern(pattern, async keys => {
            for (const key of keys) {
                await this.forget(key);
            }
        });
    }
}
