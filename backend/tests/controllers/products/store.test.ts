import 'reflect-metadata';

import { StatusCodes } from 'http-status-codes';

import { ENDPOINTS } from '@tests/endpoints';
import { ProductFactory } from '@/factories/Product';

const { BASE } = ENDPOINTS.PRODUCTS;

describe(`POST "${BASE}"`, () => {
    it('returns CREATED sending CORRECT DATA', async () => {
        const productData = ProductFactory.generate();

        const { statusCode, body } = await request.post(BASE).send(productData);

        expect(statusCode).toBe(StatusCodes.CREATED);

        expect(body).toMatchObject(productData);
    });

    it('returns BAD_REQUEST sending NO DATA', async () => {
        const { statusCode, body } = await request.post(BASE).send();

        expect(statusCode).toBe(StatusCodes.BAD_REQUEST);

        expect(body.errors).toContainMatchingObject({ message: 'Should not be empty!', param: 'name' });
        expect(body.errors).toContainMatchingObject({ message: 'Should not be empty!', param: 'description' });
        expect(body.errors).toContainMatchingObject({ message: 'Should not be empty!', param: 'price' });
        expect(body.errors).toContainMatchingObject({ message: 'Should not be empty!', param: 'stock' });
    });

    it('returns BAD_REQUEST sending NEGATIVE PRICE', async () => {
        const productData = ProductFactory.generate();

        const { statusCode, body } = await request.post(BASE).send({ ...productData, price: -1 });

        expect(statusCode).toBe(StatusCodes.BAD_REQUEST);

        expect(body.errors).toContainMatchingObject({ message: 'Cannot be a negative value!', param: 'price' });
    });
});
