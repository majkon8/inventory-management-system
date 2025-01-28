import pluralize from 'pluralize';
import { Container } from 'typedi';

import { config } from '@/config';
import { processType } from '@/enums/factories';
import { Publisher } from '@/services/queues/Publisher';
import { RedisManager } from '@/services/redis/RedisManager';
import { QueueFactory } from '@/services/queues/QueueFactory';
import { ChannelFactory } from '@/services/queues/ChannelFactory';
import { MongooseFactory } from '@/services/factories/MongooseFactory';
import { RedisClientFactory } from '@/services/factories/RedisClientFactory';
import { SyncDataConsumer } from '@/services/queues/consumers/SyncDataConsumer';
import { RabbitMQConnectionFactory } from '@/services/factories/RabbitMQConnectionFactory';

import type { IProcess } from '@/types/factories';

const {
    redisCache: { url: redisCacheUrl },
    cache: { isEnabled: isCacheEnabled, keyExpiresInMinutes: cacheKeyExpiresInMinutes },
    mongo: { writeUrl, readUrl },
    rabbitmq: { url: rabbitUrl }
} = config;

export const initFactories = async (process: IProcess) => {
    let redisCacheClient = null;
    let redisCacheManager = null;
    let mongooseWrite = null;
    let mongooseRead = null;
    let rabbitMQConnection = null;

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

    const queues = [
        {
            name: 'syncData',
            Consumer: SyncDataConsumer
        }
    ];

    const rabbitMQConnectionFactory = Container.get(RabbitMQConnectionFactory);
    rabbitMQConnection = await rabbitMQConnectionFactory.create(rabbitUrl);

    const queueFactory = Container.get(QueueFactory);
    const channelFactory = Container.get(ChannelFactory);

    Container.set('rabbitMQConnection', rabbitMQConnection);

    for (const queue of queues) {
        const { name, Consumer } = queue;

        const plural = pluralize(name);

        let channel = null;
        let publisher = null;
        let consumer = null;

        if (process !== processType.Tests) {
            channel = await channelFactory.create(rabbitMQConnection, plural);

            await queueFactory.create(channel, plural);

            publisher = new Publisher(channel, plural);

            if (process === processType.Queues) {
                consumer = new Consumer(channel, plural);
            }
        }

        Container.set(`${name}Channel`, channel);
        Container.set(`${name}Publisher`, publisher);
        Container.set(`${name}Consumer`, consumer);
    }
};
