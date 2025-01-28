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

interface IProductCommon extends BaseDocument {
    name: string;
    description: string;
    price: number;
    stock: number;
}

export interface IProductWrite extends IProductCommon {}
export interface IProductRead extends IProductCommon {}

type ProductCommonDocument = IProductCommon & Document;
type ProductWriteDocument = ProductCommonDocument;
type ProductReadDocument = ProductCommonDocument;

export interface IOrderCommon extends BaseDocument {
    customerId: string;
    products: IProductOrderData[];
}

export interface IOrderWrite extends IOrderCommon {}
