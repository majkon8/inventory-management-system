import { model } from 'mongoose';

import { productSchema } from '@/schemas/product';

import type { IProduct } from '@/types/mongo';

export const schema = productSchema;
export const modelName = 'Product';
export const collectionName = 'ProductItems';

export const Product = model<IProduct>(modelName, schema, collectionName);
