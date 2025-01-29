import 'reflect-metadata';

import { Container } from 'typedi';
import { StatusCodes } from 'http-status-codes';

import { ENDPOINTS } from '@tests/endpoints';
import { ProductFactory } from '@/factories/Product';
import { Publisher } from '@/services/queues/Publisher';

import type { ProductWriteDocument } from '@/types/mongo';

const { BASE, SELL } = ENDPOINTS.PRODUCTS;

describe(`POST "${SELL}"`, () => {
    let product: ProductWriteDocument;
    let syncDataPublisher: jest.SpyInstance;

    beforeAll(async () => {
        product = await ProductFactory.create(true, { stock: 100 });
        syncDataPublisher = jest.spyOn(Container.get<Publisher>('syncDataPublisher'), 'publish');
    });

    it('returns NO_CONTENT sending CORRECT DATA', async () => {
        const initialStock = product.stock;
        const quantity = 1;

        const { statusCode } = await request.post(`${BASE}/${product._id}/sell`).send({ quantity });

        expect(statusCode).toBe(StatusCodes.NO_CONTENT);

        expect(syncDataPublisher).toHaveBeenCalledTimes(1);
        expect(syncDataPublisher).toHaveBeenCalledWith({
            modelName: 'PRODUCT',
            actionName: 'UPDATED',
            data: expect.objectContaining({
                name: product.name,
                description: product.description,
                price: product.price,
                stock: initialStock - quantity
            })
        });
    });

    it('returns NO_CONTENT sending QUANTITY higher than STOCK', async () => {
        const initialStock = product.stock;
        const quantity = initialStock + 1;

        const { statusCode } = await request.post(`${BASE}/${product._id}/sell`).send({ quantity });

        expect(statusCode).toBe(StatusCodes.NO_CONTENT);

        expect(syncDataPublisher).toHaveBeenCalledWith({
            modelName: 'PRODUCT',
            actionName: 'UPDATED',
            data: expect.objectContaining({
                name: product.name,
                description: product.description,
                price: product.price,
                stock: 0
            })
        });
    });

    it('returns BAD_REQUEST sending NO DATA', async () => {
        const { statusCode, body } = await request.post(`${BASE}/${product._id}/sell`).send();

        expect(statusCode).toBe(StatusCodes.BAD_REQUEST);

        expect(body.errors).toContainMatchingObject({ message: 'Should not be empty!', param: 'quantity' });
    });

    it('returns BAD_REQUEST sending NEGATIVE QUANTITY', async () => {
        const { statusCode, body } = await request.post(`${BASE}/${product._id}/sell`).send({ quantity: -1 });

        expect(statusCode).toBe(StatusCodes.BAD_REQUEST);

        expect(body.errors).toContainMatchingObject({ message: 'Cannot be a negative value!', param: 'quantity' });
    });
});
