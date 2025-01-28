import { Channel } from 'amqplib';

import { Logger } from '@/services/common/Logger';

import type { Consumer } from '@/services/queues/Consumer';
import type { IPublisherMessage } from '@/types/publisher';

export class Publisher {
    constructor(
        private channel: Channel,
        private name: string,
        private isExchange = false
    ) {
        Logger.info(`Publisher #${this.name}${this.isExchange ? '(exchange)' : ''} instance created!`);
    }

    publish<T extends Consumer = Consumer>(message: IPublisherMessage<T>) {
        Logger.info(`Publisher #${this.name}${this.isExchange ? '(exchange)' : ''} published message!`);

        const parsedMessage = Buffer.from(JSON.stringify(message));

        if (this.isExchange) {
            this.channel.publish(this.name, '', parsedMessage);
        } else {
            this.channel.sendToQueue(this.name, parsedMessage);
        }
    }
}
