import { model } from 'mongoose';

import { orderWriteSchema } from '@/schemas/orderWrite';

import type { IOrderWrite } from '@/types/mongo';

export const schema = orderWriteSchema;
export const modelName = 'OrderWrite';
export const collectionName = 'OrderItems';

export const OrderWrite = model<IOrderWrite>(modelName, schema, collectionName);
