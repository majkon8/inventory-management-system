import { Service } from 'typedi';
import { readdir } from 'fs/promises';
import mongoose, { Connection } from 'mongoose';

import { Logger } from '@/services/common/Logger';

@Service()
export class MongooseFactory {
    async create(url: string, isRead: boolean) {
        const connection = mongoose.createConnection(url, {
            retryWrites: true,
            w: 'majority'
        });

        await this.initModels(connection, isRead);

        Logger.info('Mongoose created!');

        return connection;
    }

    private async initModels(connection: Connection, isRead: boolean) {
        const extension = __filename.split('.').pop() || 'ts';
        const modelsDirectory = isRead ? `${__dirname}/../../models/read` : `${__dirname}/../../models/write`;
        const fsItems: string[] = await readdir(modelsDirectory);

        for (const item of fsItems) {
            if (item.toLocaleLowerCase() === `model.${extension}` || !item.endsWith(`.${extension}`)) {
                continue;
            }

            const file = await import(`${modelsDirectory}/${item}`);

            const { modelName, schema, collectionName } = file;

            connection.model(modelName, schema, collectionName);
        }
    }
}
