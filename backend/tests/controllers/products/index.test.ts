import 'reflect-metadata';

import { StatusCodes } from 'http-status-codes';

import { ENDPOINTS } from '@tests/endpoints';
import { ProductFactory } from '@/factories/Product';

import type { ProductWriteDocument } from '@/types/mongo';

const { BASE } = ENDPOINTS.PRODUCTS;

describe(`GET "${BASE}"`, () => {
    let productOne: ProductWriteDocument;
    let productTwo: ProductWriteDocument;

    beforeAll(async () => {
        productOne = await ProductFactory.create(true);
        productTwo = await ProductFactory.create(true);
    });

    it('returns OK sending CORRECT DATA', async () => {
        const { statusCode } = await request.get(BASE);

        expect(statusCode).toBe(StatusCodes.OK);
    });
});
