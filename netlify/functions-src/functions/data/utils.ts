import { ObjectId, type Filter, type MatchKeysAndValues, type OptionalId, type OptionalUnlessRequiredId, type WithId } from 'mongodb';
import { getCollection } from '../utils/db';
import type { BaseExistingEntity, CollectionName, EntityPayload, UpsertResult } from './types';
import { DataError } from './errors';

export const upsertEntityByCondition = async <T extends OptionalId<unknown>>(
  collectionName: CollectionName,
  condition: Filter<T>,
  entity: MatchKeysAndValues<T>,
): UpsertResult<T> => {
  const collection = getCollection<T>(collectionName);
  const { value: upsertedEntity, lastErrorObject } = await collection.findOneAndUpdate(
    condition,
    { $set: entity },
    { upsert: true, returnDocument: 'after', includeResultMetadata: true }
  );
  const isNew = lastErrorObject?.updatedExisting === false;
  if (!upsertedEntity) {
    throw new Error('Failed to upsert application');
  }
  return {
    data: upsertedEntity,
    isNew,
  };
}

export async function upsertEntity<T extends BaseExistingEntity>(collectionName: CollectionName, entity: EntityPayload<T>): Promise<WithId<T>> {
  const collection = getCollection<T>(collectionName);
  const { _id: entityId, ...entityData } = entity;

  if (entityId) {
    const updatedEntity = await collection.findOneAndUpdate(
      { _id: new ObjectId(entityId) as Filter<T> },
      {
        $set: entityData as Partial<T>,
      },
      { returnDocument: "after" }
    );
    if (!updatedEntity) {
      throw new DataError(404, `${collectionName}: entitiy id: '${entity._id}' not found`);
    }
    return updatedEntity;
  } else {
    const entityPayload = {
      ...entity as OptionalUnlessRequiredId<T>,
      createdAt: new Date(),
    };
    const result = await collection.insertOne(entityPayload);
    return { ...entityPayload, _id: result.insertedId } as WithId<T>;
  }
}
