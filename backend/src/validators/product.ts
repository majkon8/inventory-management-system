import { body } from 'express-validator';

export const store = [
    body(['name', 'description'])
        .trim()
        .notEmpty()
        .withMessage('Should not be empty!')
        .bail()
        .isLength({ max: 50 })
        .withMessage('Maximum length is 50 characters!'),

    body(['price', 'stock'])
        .notEmpty()
        .withMessage('Should not be empty!')
        .bail()
        .isInt({ min: 0 })
        .withMessage('Cannot be a negative value!')
];

export const restockAndSell = [
    body('value')
        .notEmpty()
        .withMessage('Should not be empty!')
        .bail()
        .isInt({ min: 0 })
        .withMessage('Cannot be a negative value!')
];
