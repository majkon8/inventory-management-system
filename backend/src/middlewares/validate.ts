import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { matchedData, validationResult } from 'express-validator';

export const validate = async (request: Request, response: Response, next: NextFunction) => {
    const validationErrors = validationResult(request);

    if (validationErrors.isEmpty()) {
        const data = matchedData(request, { locations: ['body'] });

        request.body = data[''] || data;

        return next();
    }

    const errors = validationErrors.array().map(e => {
        if (!('path' in e)) {
            throw new Error(`"Path" not specified in error object (${JSON.stringify(e)}), url: ${request.url}.`);
        }

        if (e.location !== 'body') {
            return { message: e.msg, param: e.path, location: e.location };
        }

        return { message: e.msg, param: e.path };
    });

    return response.status(StatusCodes.BAD_REQUEST).send({ errors });
};
