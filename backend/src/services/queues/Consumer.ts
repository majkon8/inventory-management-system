import colors from 'colors';
import { Channel, Message } from 'amqplib';

import { Logger } from '@/services/common/Logger';

export abstract class Consumer {
    private errorHandler: (error: Error) => void;

    protected abstract processing(item: unknown): void;

    constructor(
        private channel: Channel,
        private name: string
    ) {
        Logger.info(`Consumer #${this.name} instance created!`);
    }

    consume(errorHandler = (error: Error) => console.error(error)) {
        Logger.info(`Consumer #${this.name} started!`);

        this.errorHandler = errorHandler;

        Promise.resolve(this.channel).then(channel => this._consume(channel));
    }

    private _consume(channel: Channel) {
        channel.consume(this.name, message => this.work(channel, message));
    }

    private async work(channel: Channel, message: Message | null) {
        if (!message?.content) {
            throw new Error("Message doesn't contain content!");
        }

        Logger.info(`Consumer #${this.name} ${colors.cyan('consumed message')}!`);

        try {
            const item = JSON.parse(message.content.toString());

            await this.processing(item);

            await channel.ack(message);

            Logger.info(`Consumer #${this.name} ${colors.green('acknowledged message')}!`);
        } catch (error: unknown) {
            await channel.reject(message, false);

            Logger.info(`Consumer #${this.name} ${colors.red('rejected message!')}!`);

            if (error instanceof Error) {
                this.errorHandler(error);
            }
        }
    }
}
