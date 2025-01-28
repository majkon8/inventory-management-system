import { model } from 'mongoose';

import { productReadSchema } from '@/schemas/productRead';

import type { IProductRead } from '@/types/mongo';

export const schema = productReadSchema;
export const modelName = 'ProductRead';
export const collectionName = 'ProductItems';

export const ProductRead = model<IProductRead>(modelName, schema, collectionName);
