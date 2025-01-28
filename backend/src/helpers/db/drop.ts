import mongoose from 'mongoose';

import { config } from '@/config';

const {
    mongo: { writeUrl, readUrl }
} = config;

export const drop = async () => {
    console.log('Drop script has started.');

    const writeConnection = mongoose.createConnection(writeUrl, {
        retryWrites: true,
        w: 'majority'
    });

    const readConnection = mongoose.createConnection(readUrl, {
        retryWrites: true,
        w: 'majority'
    });

    await writeConnection.dropDatabase();
    await readConnection.dropDatabase();

    console.log('Database has been deleted by root.');

    await writeConnection.close();
    await readConnection.close();

    console.log('Drop script has finished.');
};
