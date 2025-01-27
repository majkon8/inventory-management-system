import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import { CORSError } from '@/errors/CORSError';
import { NoDatabaseError } from '@/errors/NoDatabaseError';
import { UnprocessableEntityError } from '@/errors/UnprocessableEntityError';

export const errorHandler = async (
    err: Error,
    request: Request,
    response: Response,
    // node requires 4 params in middlewares
    // eslint-disable-next-line
    next: NextFunction
) => {
    if (err instanceof CORSError) {
        return response.send({ message: err.message });
    }

    if (err instanceof NoDatabaseError) {
        return response.status(StatusCodes.CONFLICT).send({ message: err.message });
    }

    if (err instanceof UnprocessableEntityError) {
        const data: Record<string, string> = {};

        const { code, message } = err;

        if (code) {
            data.code = code;
        }

        if (message) {
            data.message = message;
        }

        return response.status(StatusCodes.UNPROCESSABLE_ENTITY).send(data);
    }

    console.error(err);

    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send('We messed something up. Sorry!');
};
