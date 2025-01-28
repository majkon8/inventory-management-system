import { drop } from '@/helpers/db/drop';
import { clear } from '@/helpers/cache/clear';

export default async () => {
    await drop();
    await clear();
};
