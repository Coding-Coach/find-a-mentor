import type { WithId } from 'mongodb';

export type CreateEntityPayload<T extends WithId<unknown>> = Omit<T, '_id'>;