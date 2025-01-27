import { Service } from 'typedi';

import { Product } from '@/models/Product';
import { Repository } from '@/repositories/Repository';

import type { IProduct } from '@/types/mongo';

@Service()
export class ProductRepository extends Repository<typeof Product, IProduct> {
    get model() {
        return this.mongoose.models.Product;
    }
}
