import { Service } from 'typedi';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ProductQueryService } from '@/services/queries/ProductQuaryService';

@Service()
export class IndexController {
    constructor(private readonly productQueryService: ProductQueryService) {}

    async invoke(request: Request, response: Response) {
        try {
            const products = await this.productQueryService.getAllProducts();

            return response.status(StatusCodes.OK).send(products);
        } catch (error) {
            console.error('Error fetching products:', error);

            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error fetching products');
        }
    }
}
