import { Service } from 'typedi';

import { ProductWrite } from '@/models/write/Product';
import { WriteRepository } from '@/repositories/WriteRepository';

import type { IProductWrite } from '@/types/mongo';

@Service()
export class ProductWriteRepository extends WriteRepository<typeof ProductWrite, IProductWrite> {
    get model() {
        return this.mongooseWrite.models.ProductWrite;
    }
}
