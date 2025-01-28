import { isMongoId } from 'validator';
import { body } from 'express-validator';

export const store = [
    body('customerId')
        .trim()
        .notEmpty()
        .withMessage('Should not be empty!')
        .bail()
        .isMongoId()
        .withMessage('customerId must be a valid Mongo ID!'),

    body('products')
        .notEmpty()
        .withMessage('Should not be empty!')
        .bail()
        .isArray()
        .withMessage('Products should be an array!')
        .bail()
        .custom(value => {
            value.forEach((product: { id: string; quantity: number }, index: number) => {
                if (!product.id) {
                    throw new Error(`Product at index ${index} must have an 'id' property!`);
                }

                if (!isMongoId(product.id)) {
                    throw new Error(`Product at index ${index} must have an 'id' property which is a valid Mongo ID!`);
                }

                if (!product.quantity) {
                    throw new Error(`Product at index ${index} must have an 'quantity' property!`);
                }

                if (!Number.isInteger(product.quantity) || product.quantity < 1) {
                    throw new Error(
                        `Product at index ${index} must have an 'id' property which is an integer greater than 0!`
                    );
                }
            });

            return true;
        })
];
