import 'reflect-metadata';

import { StatusCodes } from 'http-status-codes';

import { ENDPOINTS } from '@tests/endpoints';
import { ProductFactory } from '@/factories/Product';

const { BASE } = ENDPOINTS.PRODUCTS;

describe(`GET "${BASE}"`, () => {
    beforeAll(async () => {
        await ProductFactory.create(true);
        await ProductFactory.create(true);
    });

    it('returns OK sending CORRECT DATA', async () => {
        const { statusCode } = await request.get(BASE);

        expect(statusCode).toBe(StatusCodes.OK);
    });
});
