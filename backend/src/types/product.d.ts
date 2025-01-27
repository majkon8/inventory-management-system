import type { Request } from 'express';
import type { Product } from '@/models/Product';

export interface IStoreRequest extends Request {
    body: Product;
}

export interface IRestockAndSellRequest extends Request {
    body: {
        value: number;
    };
}
