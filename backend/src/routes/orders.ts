import { Container } from 'typedi';
import { Router, Request, Response } from 'express';

import { store } from '@/validators/order';
import { validate } from '@/middlewares/validate';
import { StoreController } from '@/controllers/Order/StoreController';

const router: Router = Router();

router.post('/', store, validate, (request: Request, response: Response) => {
    const storeController = Container.get(StoreController);

    return storeController.invoke(request, response);
});

export { router };
