import { Container } from 'typedi';
import { Router, Request, Response } from 'express';

import { validate } from '@/middlewares/validate';
import { store, restockAndSell } from '@/validators/product';
import { SellController } from '@/controllers/Product/SellController';
import { IndexController } from '@/controllers/Product/IndexController';
import { StoreController } from '@/controllers/Product/StoreController';
import { RestockController } from '@/controllers/Product/RestockController';

const router: Router = Router();

router.get('/', (request: Request, response: Response) => {
    const indexController = Container.get(IndexController);

    return indexController.invoke(request, response);
});

router.post('/', store, validate, (request: Request, response: Response) => {
    const storeController = Container.get(StoreController);

    return storeController.invoke(request, response);
});

router.post('/:id/restock', restockAndSell, validate, (request: Request, response: Response) => {
    const restockController = Container.get(RestockController);

    return restockController.invoke(request, response);
});

router.post('/:id/sell', restockAndSell, validate, (request: Request, response: Response) => {
    const sellController = Container.get(SellController);

    return sellController.invoke(request, response);
});

export { router };
