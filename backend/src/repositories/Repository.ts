import { Inject, Service } from 'typedi';

import type {
    Connection,
    Model,
    SortOrder,
    FilterQuery,
    QueryOptions,
    MongooseBaseQueryOptionKeys,
    Types,
    UpdateQuery
} from 'mongoose';
import type { IFlattenObjectKeys, IPrefixMongoSelectKeys } from '@/types/mongo';

type IProjectionValue<T> =
    | Partial<Record<IFlattenObjectKeys<T>, 1 | 0>>
    | Array<IPrefixMongoSelectKeys<IFlattenObjectKeys<T>> | '_id'>;

@Service()
export abstract class Repository<M extends Model<T>, T> {
    constructor(
        @Inject('mongoose')
        protected readonly mongoose: Connection
    ) {}

    abstract get model(): M;

    async findAndCountAll(
        options: FilterQuery<T>,
        {
            offset,
            limit,
            sort,
            select
        }: {
            offset?: number;
            limit?: number;
            sort?: string | { [key: string]: SortOrder };
            select?: IProjectionValue<T>;
        }
    ) {
        const query = this.findAll(options);

        if (sort) {
            query.sort(sort);
        }

        if (limit) {
            query.limit(limit);
        }

        if (offset) {
            query.skip(offset);
        }

        if (select) {
            query.select(select as string[]);
        }

        const [count, rows] = await Promise.all([this.count(options), query]);

        return { count, rows };
    }

    findAll(options: FilterQuery<T> = {}, select?: IProjectionValue<T>) {
        const query = this.model.find(options);

        if (select) {
            query.select(select as string[]);
        }

        return query;
    }

    findOne(options: FilterQuery<T>, select?: IProjectionValue<T>) {
        const query = this.model.findOne(options);

        if (select) {
            query.select(select as string[]);
        }

        return query;
    }

    findById(id: string | Types.ObjectId, select?: IProjectionValue<T>) {
        const query = this.model.findById(id, select);

        return query;
    }

    count(options: FilterQuery<T> = {}) {
        return this.model.countDocuments(options);
    }

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

    findOneAndUpdate(filter: FilterQuery<T>, data: UpdateQuery<T>, options?: QueryOptions) {
        return this.model.findOneAndUpdate(filter, data, options);
    }

    updateMany(filter: FilterQuery<T>, data: UpdateQuery<T>) {
        return this.model.updateMany(filter, data);
    }
}
