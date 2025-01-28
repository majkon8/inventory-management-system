import { Service } from 'typedi';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ProductCommandService } from '@/services/command/ProductCommandService';

import type { IStoreRequest } from '@/types/product';

@Service()
export class StoreController {
    constructor(private readonly productCommandService: ProductCommandService) {}

    async invoke(request: IStoreRequest, response: Response) {
        const {
            body: { name, description, price, stock }
        } = request;

        try {
            const createdProduct = await this.productCommandService.createProduct({ name, description, price, stock });

            return response.status(StatusCodes.CREATED).send(createdProduct);
        } catch (error) {
            console.error('Error creating product:', error);

            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error creating product');
        }
    }
}
