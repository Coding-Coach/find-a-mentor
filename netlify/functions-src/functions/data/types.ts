import type { OptionalId, WithId } from 'mongodb';

export type BaseExistingEntity = WithId<{
  createdAt: Date;
}>

type UpdateEntityPayload<T> = WithId<Partial<T>>;
export type CreateEntityPayload<T> = OptionalId<T>;
export type EntityPayload<T> = CreateEntityPayload<T> | UpdateEntityPayload<T>;
export type CollectionName = 'users' | 'applications' | 'mentorships';

export type UpsertResult<T> = Promise<{
  data: WithId<T>;
  isNew: boolean;
}>
