import { Document } from 'mongoose';

export type IFlattenObjectKeys<T, Key = keyof T> = Key extends string
    ? T[Key] extends Record<string, unknown>
        ? `${Key}.${IFlattenObjectKeys<T[Key]>}`
        : `${Key}`
    : never;

export type IPrefixMongoSelectKeys<T extends string> = T extends `${infer U}` ? `-${U}` | `+${U}` | U : never;

interface BaseDocument {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProduct extends BaseDocument {
    name: string;
    description: string;
    price: number;
    stock: number;
}

export type ProductDocument = IProduct & Document;

export interface IOrder extends BaseDocument {
    customerId: string;
    products: IProductOrderData[];
}
