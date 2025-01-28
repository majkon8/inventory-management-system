import { Service } from 'typedi';
import { connect } from 'amqplib';

import { Logger } from '@/services/common/Logger';

@Service()
export class RabbitMQConnectionFactory {
    async create(connectionUrl: string) {
        const connection = await connect(connectionUrl);

        Logger.info('RabbitMQ connection instance created!');

        return connection;
    }
}
