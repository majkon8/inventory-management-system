export class NoDatabaseError extends Error {
    constructor(message = 'No Database for entity.') {
        super(message);
    }
}
