import 'reflect-metadata';

import { StatusCodes } from 'http-status-codes';

import { ENDPOINTS } from '@tests/endpoints';
import { ProductFactory } from '@/factories/Product';

import type { IProduct } from '@/types/mongo';

const { BASE } = ENDPOINTS.PRODUCTS;

describe(`GET "${BASE}"`, () => {
    let productOne: IProduct;
    let productTwo: IProduct;

    beforeAll(async () => {
        productOne = await ProductFactory.create();
        productTwo = await ProductFactory.create();
    });

    it('returns OK', async () => {
        const { statusCode, body } = await request.get(BASE);

        expect(statusCode).toBe(StatusCodes.OK);

        expect(body).toContainMatchingObject({
            name: productOne.name,
            description: productOne.description,
            price: productOne.price,
            stock: productOne.stock
        });
        expect(body).toContainMatchingObject({
            name: productTwo.name,
            description: productTwo.description,
            price: productTwo.price,
            stock: productTwo.stock
        });
    });
});
