import { Channel } from 'amqplib';
import { Container, Service } from 'typedi';

import { Consumer } from '@/services/queues/Consumer';

import { model, action } from '@/enums/syncData';

import type { Connection } from 'mongoose';
import type { ISyncDataConsumerOptions } from '@/types/syncData';

@Service()
export class SyncDataConsumer extends Consumer {
    private mongooseRead: Connection;

    constructor(channel: Channel, name: string) {
        super(channel, name);

        this.mongooseRead = Container.get('mongooseRead');
    }

    async processing({ modelName, actionName, data }: ISyncDataConsumerOptions) {
        const dataModel = this.getModel(modelName);

        if (!dataModel) {
            return;
        }

        if (actionName === action.Created) {
            return dataModel.create(data);
        }

        if (actionName === action.Updated) {
            return dataModel.updateOne({ _id: data._id }, { $set: { ...data } });
        }
    }

    private getModel(modelName: model) {
        if (modelName === model.Product) {
            return this.mongooseRead.models.ProductRead;
        }
    }
}
