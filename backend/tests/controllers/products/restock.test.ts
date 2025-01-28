import 'reflect-metadata';

import { StatusCodes } from 'http-status-codes';

import { ENDPOINTS } from '@tests/endpoints';
import { ProductFactory } from '@/factories/Product';

import type { ProductWriteDocument } from '@/types/mongo';

const { BASE, RESTOCK } = ENDPOINTS.PRODUCTS;

describe(`POST "${RESTOCK}"`, () => {
    let product: ProductWriteDocument;

    beforeAll(async () => {
        product = await ProductFactory.create();
    });

    it('returns NO_CONTENT sending CORRECT DATA', async () => {
        const initialStock = product.stock;
        const quantity = 100;

        const { statusCode } = await request.post(`${BASE}/${product._id}/restock`).send({ quantity });

        expect(statusCode).toBe(StatusCodes.NO_CONTENT);

        const { body } = await request.get(BASE);

        expect(body).toContainMatchingObject({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: initialStock + quantity
        });
    });

    it('returns BAD_REQUEST sending NO DATA', async () => {
        const { statusCode, body } = await request.post(`${BASE}/${product._id}/restock`).send();

        expect(statusCode).toBe(StatusCodes.BAD_REQUEST);

        expect(body.errors).toContainMatchingObject({ message: 'Should not be empty!', param: 'quantity' });
    });

    it('returns BAD_REQUEST sending NEGATIVE QUANTITY', async () => {
        const { statusCode, body } = await request.post(`${BASE}/${product._id}/restock`).send({ quantity: -1 });

        expect(statusCode).toBe(StatusCodes.BAD_REQUEST);

        expect(body.errors).toContainMatchingObject({ message: 'Cannot be a negative value!', param: 'quantity' });
    });
});
