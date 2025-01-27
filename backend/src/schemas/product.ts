import { Schema } from 'mongoose';

import type { IProduct } from '@/types/mongo';

export const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
            maxLength: 50
        },
        description: {
            type: String,
            required: true,
            maxLength: 50
        },
        // price in cents
        price: {
            type: Number,
            required: true,
            min: 0
        },
        stock: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    }
);
