import { Container } from 'typedi';
import { faker } from '@faker-js/faker';

import { ProductRepository } from '@/repositories/ProductRepository';

import type { IProductFactoryData } from '@/types/factories';

export class ProductFactory {
    static generate(props: Partial<IProductFactoryData> = {}) {
        const name = faker.lorem.words(faker.number.int({ min: 1, max: 3 }));
        const description = faker.lorem.words(faker.number.int({ min: 3, max: 5 }));
        const price = faker.number.int({ min: 100, max: 100000 });
        const stock = faker.number.int({ min: 100, max: 100000 });

        const defaultProps: IProductFactoryData = {
            name,
            description,
            price,
            stock
        };

        return { ...defaultProps, ...props };
    }

    static async create(props: Partial<IProductFactoryData> = {}) {
        const productRepository = Container.get(ProductRepository);

        const productData = ProductFactory.generate(props);

        return productRepository.create(productData);
    }
}
