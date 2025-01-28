import { Inject, Service } from 'typedi';

import type { Connection, Model, FilterQuery, QueryOptions, MongooseBaseQueryOptionKeys, UpdateQuery } from 'mongoose';

@Service()
export abstract class WriteRepository<M extends Model<T>, T> {
    constructor(
        @Inject('mongooseWrite')
        protected readonly mongooseWrite: Connection
    ) {}

    abstract get model(): M;

    create(data: Partial<T>) {
        return this.model.create(data);
    }

    bulkCreate(documents: Partial<T>[]) {
        return this.model.insertMany(documents);
    }

    deleteOne(query: FilterQuery<T>, options?: Pick<QueryOptions<T>, MongooseBaseQueryOptionKeys>) {
        return this.model.deleteOne(query, options);
    }

    updateOne(filter: FilterQuery<T>, data: UpdateQuery<T>) {
        return this.model.updateOne(filter, data);
    }

    updateMany(filter: FilterQuery<T>, data: UpdateQuery<T>) {
        return this.model.updateMany(filter, data);
    }

    findOneAndUpdate(filter: FilterQuery<T>, data: UpdateQuery<T>, options?: QueryOptions) {
        return this.model.findOneAndUpdate(filter, data, options);
    }
}
