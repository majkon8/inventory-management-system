import 'reflect-metadata';
import 'module-alias/register';

import { Container } from 'typedi';

import { config } from '@/config';
import { MongooseFactory } from '@/services/factories/MongooseFactory';

(async () => {
    const mongooseFactory = Container.get(MongooseFactory);
    const mongoose = await mongooseFactory.create(config.mongo.url);

    Container.set('mongoose', mongoose);

    await mongoose.destroy();
})();
