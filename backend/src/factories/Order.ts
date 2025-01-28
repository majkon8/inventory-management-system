import { faker } from '@faker-js/faker';

export class OrderFactory {
    static generateId() {
        return faker.database.mongodbObjectId();
    }
}
