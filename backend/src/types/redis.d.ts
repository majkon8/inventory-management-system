import type { Product } from '@/models/Product';

export type ICacheRedis = {
    'products:index': Product;
};
