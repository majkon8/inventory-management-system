import { model } from 'mongoose';

import { orderSchema } from '@/schemas/order';

import type { IOrder } from '@/types/mongo';

export const schema = orderSchema;
export const modelName = 'Order';
export const collectionName = 'OrderItems';

export const Order = model<IOrder>(modelName, schema, collectionName);
