import { Service } from 'typedi';

import { ProductRead } from '@/models/read/Product';
import { ReadRepository } from '@/repositories/ReadRepository';

import type { IProductRead } from '@/types/mongo';

@Service()
export class ProductReadRepository extends ReadRepository<typeof ProductRead, IProductRead> {
    get model() {
        return this.mongooseRead.models.ProductRead;
    }
}
