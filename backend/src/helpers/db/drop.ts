import mongoose from 'mongoose';

import { config } from '@/config';

const {
    mongo: { writeUrl, readUrl }
} = config;

export const drop = async () => {
    console.log('Drop script has started.');

    const { connection: writeConnection } = await mongoose.connect(writeUrl, {
        retryWrites: true,
        w: 'majority'
    });

    const { connection: readConnection } = await mongoose.connect(readUrl, {
        retryWrites: true,
        w: 'majority'
    });

    await writeConnection.db?.dropDatabase();
    await readConnection.db?.dropDatabase();

    console.log('Database has been deleted by root.');

    await writeConnection.close();
    await readConnection.close();

    console.log('Drop script has finished.');
};
