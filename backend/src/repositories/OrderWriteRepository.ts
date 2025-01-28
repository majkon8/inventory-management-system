import { Service } from 'typedi';

import { OrderWrite } from '@/models/write/Order';
import { WriteRepository } from '@/repositories/WriteRepository';

import type { IOrderWrite } from '@/types/mongo';

@Service()
export class OrderWriteRepository extends WriteRepository<typeof OrderWrite, IOrderWrite> {
    get model() {
        return this.mongooseWrite.models.OrderWrite;
    }
}
