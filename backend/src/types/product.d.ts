import type { Request } from 'express';
import type { IProduct } from '@/types/mongo';

export interface IStoreRequest extends Request {
    body: IProduct;
}

export interface IRestockAndSellRequest extends Request {
    body: {
        quantity: number;
    };
}
