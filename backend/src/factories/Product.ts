import { Container } from 'typedi';
import { faker } from '@faker-js/faker';
import { Connection as MongooseConnection } from 'mongoose';

import { ProductWriteRepository } from '@/repositories/ProductWriteRepository';

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

    static async create(readFirst: boolean, props: Partial<IProductFactoryData> = {}) {
        const mongooseRead: MongooseConnection = Container.get('mongooseRead');
        const productWriteRepository = Container.get(ProductWriteRepository);

        const productData = ProductFactory.generate(props);

        if (readFirst) {
            await mongooseRead.models.ProductRead.create(productData);

            return productWriteRepository.create(productData);
        }

        await productWriteRepository.create(productData);

        return mongooseRead.models.ProductRead.create(productData);
    }
}
