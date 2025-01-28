export enum model {
    Product = 'PRODUCT'
}

export enum action {
    Created = 'CREATED',
    Updated = 'UPDATED'
}

export const ALL_MODELS = Object.values(model);

export const ALL_ACTIONS = Object.values(action);
