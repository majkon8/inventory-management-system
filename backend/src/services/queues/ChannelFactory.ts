import { Service } from 'typedi';
import { Connection } from 'amqplib';

import { Logger } from '@/services/common/Logger';

interface IChannelParams {
    durable?: boolean;
}

@Service()
export class ChannelFactory {
    async create(connection: Connection, name: string, isExchange = false, params: IChannelParams = {}) {
        const channel = await connection.createChannel();

        if (isExchange) {
            await channel.assertExchange(name, 'fanout', params);
        } else {
            await channel.prefetch(1);
        }

        Logger.info(`Channel #${name}${isExchange ? '(exchange)' : ''} instance created!`);

        return channel;
    }
}
