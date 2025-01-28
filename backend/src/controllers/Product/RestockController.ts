import { Service } from 'typedi';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ProductCommandService } from '@/services/command/ProductCommandService';

import type { IRestockAndSellRequest } from '@/types/product';

@Service()
export class RestockController {
    constructor(private readonly productCommandService: ProductCommandService) {}

    async invoke(request: IRestockAndSellRequest, response: Response) {
        const {
            params: { id },
            body: { quantity }
        } = request;

        try {
            const updated = await this.productCommandService.restockProduct(id, quantity);

            if (!updated) {
                return response.sendStatus(StatusCodes.NOT_FOUND);
            }

            return response.sendStatus(StatusCodes.NO_CONTENT);
        } catch (error) {
            console.error('Error updating product stock:', error);

            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error updating product stock');
        }
    }
}
