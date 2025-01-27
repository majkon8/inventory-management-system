import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/', (request: Request, response: Response) => {
    return response.send('Default route');
});

export { router };
