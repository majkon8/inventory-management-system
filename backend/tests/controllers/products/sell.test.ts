import 'reflect-metadata';

import { StatusCodes } from 'http-status-codes';

import { ENDPOINTS } from '@tests/endpoints';
import { ProductFactory } from '@/factories/Product';

import type { IProduct } from '@/types/mongo';

const { BASE, SELL } = ENDPOINTS.PRODUCTS;

describe(`POST "${SELL}"`, () => {
    let product: IProduct;

    beforeAll(async () => {
        product = await ProductFactory.create({ stock: 100 });
    });

    it('returns NO_CONTENT sending CORRECT DATA', async () => {
        const initialStock = product.stock;
        const quantity = 10;

        const { statusCode } = await request.post(`${BASE}/${product._id}/sell`).send({ quantity });

        expect(statusCode).toBe(StatusCodes.NO_CONTENT);

        const { body } = await request.get(BASE);

        expect(body).toContainMatchingObject({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: initialStock - quantity
        });
    });

    it('returns NO_CONTENT sending QUANTITY higher than STOCK', async () => {
        const initialStock = product.stock;
        const quantity = initialStock + 1;

        const { statusCode } = await request.post(`${BASE}/${product._id}/sell`).send({ quantity });

        expect(statusCode).toBe(StatusCodes.NO_CONTENT);

        const { body } = await request.get(BASE);

        expect(body).toContainMatchingObject({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: 0
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
