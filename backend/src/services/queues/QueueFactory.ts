import { Service } from 'typedi';
import { Channel } from 'amqplib';

import { Logger } from '@/services/common/Logger';

interface IChannelParams {
    durable?: boolean;
    exclusive?: boolean;
}

@Service()
export class QueueFactory {
    async create(channel: Channel, name: string, params: IChannelParams = {}, bindQueue = false) {
        const names = {
            errorsExchange: `${name}-errors-exchange`
        };

        const queue = await channel.assertQueue(bindQueue ? '' : name, {
            ...params,
            deadLetterExchange: names.errorsExchange
        });

        if (bindQueue) {
            await channel.bindQueue(queue.queue, name, '');
        }

        Logger.info(`Queue #${name} instance created!`);

        return queue;
    }
}
