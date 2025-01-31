import 'reflect-metadata';
import 'module-alias/register';

import { register } from 'ts-node';

import { drop } from '@/helpers/db/drop';
import { clear } from '@/helpers/cache/clear';
import { shutdown } from '@/plugins/shutdown';
import { processType } from '@/enums/factories';
import { initFactories } from '@/plugins/initFactories';

register({ transpileOnly: true });

export default async () => {
    await initFactories(processType.Tests);

    await drop();
    await clear();

    await shutdown();
};
