import helmet from 'helmet';
import express, { Express, json, raw } from 'express';

import { getRouter } from '@/routes';
import { corsPlugin } from '@/plugins/cors';
import { errorHandler } from '@/plugins/errorHandler';
import { initFactories } from '@/plugins/initFactories';

export const getApp = async () => {
    await initFactories();

    const app: Express = express();

    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    'script-src': ["'self'", 'https://cdn.jsdelivr.net/', "'unsafe-inline'"]
                }
            },
            crossOriginResourcePolicy: { policy: 'cross-origin' }
        })
    );
    app.use(corsPlugin);

    app.use((req, res, next) => {
        const rawPaths: string[] = [];

        if (rawPaths.includes(req.originalUrl)) {
            raw({ type: 'application/json' })(req, res, next);
        } else {
            json()(req, res, next);
        }
    });

    const router = await getRouter();

    app.use('/api', router);

    app.use(errorHandler);

    return app;
};
