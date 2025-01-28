import 'reflect-metadata';

import { StatusCodes } from 'http-status-codes';

import { ENDPOINTS } from '@tests/endpoints';
import { OrderFactory } from '@/factories/Order';
import { ProductFactory } from '@/factories/Product';

import type { IProduct } from '@/types/mongo';

const { BASE: ORDERS_BASE } = ENDPOINTS.ORDERS;
const { BASE: PRODUCTS_BASE } = ENDPOINTS.PRODUCTS;

describe(`POST "${ORDERS_BASE}"`, () => {
    let productOne: IProduct;
    let productTwo: IProduct;

    beforeAll(async () => {
        productOne = await ProductFactory.create();
        productTwo = await ProductFactory.create();
    });

    it('returns CREATED sending CORRECT DATA', async () => {
        const productOneInitialStock = productOne.stock;
        const productTwoInitialStock = productTwo.stock;
        const productOneQuantity = 1;
        const productTwoQuantity = 2;
        const orderData = {
            customerId: OrderFactory.generateId(),
            products: [
                { id: productOne._id, quantity: productOneQuantity },
                { id: productTwo._id, quantity: productTwoQuantity }
            ]
        };

        const { statusCode } = await request.post(ORDERS_BASE).send(orderData);

        expect(statusCode).toBe(StatusCodes.CREATED);

        const { body } = await request.get(PRODUCTS_BASE);

        expect(body).toContainMatchingObject({
            name: productOne.name,
            description: productOne.description,
            price: productOne.price,
            stock: productOneInitialStock - productOneQuantity
        });
        expect(body).toContainMatchingObject({
            name: productTwo.name,
            description: productTwo.description,
            price: productTwo.price,
            stock: productTwoInitialStock - productTwoQuantity
        });
    });

    it('returns BAD_REQUEST sending NO DATA', async () => {
        const { statusCode, body } = await request.post(ORDERS_BASE).send();

        expect(statusCode).toBe(StatusCodes.BAD_REQUEST);

        expect(body.errors).toContainMatchingObject({ message: 'Should not be empty!', param: 'customerId' });
        expect(body.errors).toContainMatchingObject({ message: 'Should not be empty!', param: 'products' });
    });

    it('returns BAD_REQUEST sending NEGATIVE QUANTITY', async () => {
        const orderData = {
            customerId: OrderFactory.generateId(),
            products: [{ id: productOne._id, quantity: -1 }]
        };

        const { statusCode, body } = await request.post(ORDERS_BASE).send(orderData);

        expect(statusCode).toBe(StatusCodes.BAD_REQUEST);

        expect(body.errors).toContainMatchingObject({
            message: "Product at index 0 must have an 'id' property which is an integer greater than 0!",
            param: 'products'
        });
    });

    it('returns NOT_FOUND sending NONEXISTING PRODUCT', async () => {
        const orderData = {
            customerId: OrderFactory.generateId(),
            products: [
                { id: productOne._id, quantity: 1 },
                { id: OrderFactory.generateId(), quantity: 1 }
            ]
        };

        const { statusCode, body } = await request.post(ORDERS_BASE).send(orderData);

        expect(statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    it('returns BAD_REQUEST sending QUANTITY higher than current STOCK', async () => {
        const orderData = {
            customerId: OrderFactory.generateId(),
            products: [{ id: productOne._id, quantity: productOne.stock + 1 }]
        };

        const { statusCode } = await request.post(ORDERS_BASE).send(orderData);

        expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
});
