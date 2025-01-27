export interface IAppConfig {
    env: string;
    isDev: boolean;
    isTest: boolean;
    port: number;
    url: string;
    corsSites: string;
}

export interface IRedisConfig {
    url: string;
    host: string;
    port: number;
    password: string;
    ttl: string;
}

export interface ICacheConfig {
    isEnabled: boolean;
    keyExpiresInMinutes: number;
}

export interface IMongoConfig {
    username: string;
    password: string;
    database: string;
    host: string;
    port: number;
    url: string;
}

export interface IConfig {
    app: IAppConfig;
    redisCache: IRedisConfig;
    cache: ICacheConfig;
    mongo: IMongoConfig;
}
