import { Schema } from 'mongoose';

import type { IOrder } from '@/types/mongo';

export const orderSchema = new Schema<IOrder>(
    {
        customerId: {
            type: String,
            required: true,
            maxLength: 50
        },
        products: [
            {
                _id: false,
                id: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    }
);
