import { Schema } from 'mongoose';

import type { IProductRead } from '@/types/mongo';

export const productReadSchema = new Schema<IProductRead>(
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
        price: {
            type: Number,
            required: true,
            min: [0, 'Price must be positive']
        },
        stock: {
            type: Number,
            required: true,
            min: [0, 'Stock must be positive']
        }
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    }
);
