import type { Request } from 'express';
import type { IOrder } from '@/types/mongo';

export interface IProductOrderData extends BaseDocument {
    id: string;
    quantity: number;
}

interface IOrderData extends BaseDocument {
    customerId: string;
    products: IProductOrderData[];
}

export interface IStoreRequest extends Request {
    body: IOrderData;
}
