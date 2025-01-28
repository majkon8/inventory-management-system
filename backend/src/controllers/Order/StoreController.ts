import { Service } from 'typedi';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { OrderCommandService } from '@/services/command/OrderCommandService';

import type { IStoreRequest } from '@/types/order';

@Service()
export class StoreController {
    constructor(private readonly orderCommandService: OrderCommandService) {}

    async invoke(request: IStoreRequest, response: Response) {
        try {
            const result = await this.orderCommandService.placeOrder(request.body);

            if (result.message) {
                return response.status(result.status).send(result.message);
            }

            return response.sendStatus(result.status);
        } catch (error) {
            console.error('Error placing order:', error);

            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error placing order');
        }
    }
}
