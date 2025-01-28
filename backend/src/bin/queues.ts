import 'reflect-metadata';
import 'module-alias/register';

import { Container } from 'typedi';
import { checkSync, lockSync } from 'proper-lockfile';

import { shutdown } from '@/plugins/shutdown';
import { processType } from '@/enums/factories';
import { Consumer } from '@/services/queues/Consumer';
import { initFactories } from '@/plugins/initFactories';

process.on('SIGINT', () => shutdown(true));
process.on('SIGTERM', () => shutdown(true));
process.on('exit', () => shutdown(true));

const runQueues = async () => {
    try {
        const isLocked = checkSync(__filename);

        if (isLocked) {
            console.info(`This script is already running!`);
            process.exit(1);
        }

        lockSync(__filename);

        await initFactories(processType.Queues);

        const consumerNames = ['syncDataConsumer'];

        for (const name of consumerNames) {
            const consumer: Consumer = Container.get(name);

            consumer.consume();
        }

        console.info('Queues started...');
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
        }

        process.exit(1);
    }
};

runQueues();
