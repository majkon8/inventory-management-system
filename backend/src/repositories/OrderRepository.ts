import { Service } from 'typedi';

import { Order } from '@/models/Order';
import { Repository } from '@/repositories/Repository';

import type { IOrder } from '@/types/mongo';

@Service()
export class OrderRepository extends Repository<typeof Order, IOrder> {
    get model() {
        return this.mongoose.models.Order;
    }
}
