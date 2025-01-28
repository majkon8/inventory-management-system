import mongoose from 'mongoose';

import { config } from '@/config';

const {
    mongo: { url: mongoUrl }
} = config;

export const drop = async () => {
    console.log('Drop script has started.');

    const { connection } = await mongoose.connect(mongoUrl, {
        retryWrites: true,
        w: 'majority'
    });

    await connection.db?.dropDatabase();

    console.log('Database has been deleted by root.');

    await connection.close();

    console.log('Drop script has finished.');
};
