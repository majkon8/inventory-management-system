import { Schema } from 'mongoose';

import type { IOrderWrite } from '@/types/mongo';

export const orderWriteSchema = new Schema<IOrderWrite>(
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
