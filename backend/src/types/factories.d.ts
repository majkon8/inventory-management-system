import type { Product } from '@/models/Product';

export type IProcess = 'API' | 'TESTS';

export type IProductFactoryData = Pick<Product, 'name' | 'description' | 'price' | 'stock'>;
