import { model } from 'mongoose';

import { productWriteSchema } from '@/schemas/productWrite';

import type { IProductWrite } from '@/types/mongo';

export const schema = productWriteSchema;
export const modelName = 'ProductWrite';
export const collectionName = 'ProductItems';

export const ProductWrite = model<IProductWrite>(modelName, schema, collectionName);
