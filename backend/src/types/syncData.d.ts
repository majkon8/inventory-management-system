import type { ProductWriteDocument } from '@/types/mongo';
import { ALL_MODELS, ALL_ACTIONS } from '@/enums/syncData';

export interface ISyncDataConsumerOptions {
    modelName: ALL_MODELS;
    actionName: ALL_ACTIONS;
    data: ProductWriteDocument;
}
