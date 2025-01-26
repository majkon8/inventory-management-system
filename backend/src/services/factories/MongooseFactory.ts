import { Service } from 'typedi';
import { readdir } from 'fs/promises';
import mongoose, { Connection } from 'mongoose';

import { Logger } from '@/services/common/Logger';

@Service()
export class MongooseFactory {
    async create(url: string) {
        console.log(url);
        const { connection } = await mongoose.connect(url);
        console.log(true);

        console.log(connection);

        await this.initModels(connection);

        Logger.info('Mongoose created!');

        return connection;
    }

    private async initModels(connection: Connection) {
        const extension = __filename.split('.').pop() || 'ts';
        const modelsDirectory = `${__dirname}/../../models`;
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
