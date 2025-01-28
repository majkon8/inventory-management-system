import type { Product } from '@/models/Product';

export type IProcess = 'API' | 'TESTS' | 'QUEUES';

export type IProductFactoryData = Pick<Product, 'name' | 'description' | 'price' | 'stock'>;
