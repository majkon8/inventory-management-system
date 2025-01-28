import type { ISyncDataConsumerOptions } from '@/types/syncData';
import type { SyncDataConsumer } from '@/services/queues/consumers/SyncDataConsumer';

export type IPublisherMessage<T> = T extends SyncDataConsumer ? ISyncDataConsumerOptions : Record<string, unknown>;
