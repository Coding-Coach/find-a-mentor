import { ObjectId, type Filter, type OptionalUnlessRequiredId, type WithId } from 'mongodb';
import { getCollection } from '../utils/db';
import type { EntityPayload } from './types';
import { DataError } from './errors';

export async function upsertEntity<T extends WithId<unknown>>(collectionName: string, entity: EntityPayload<T>): Promise<WithId<T>> {
  const collection = getCollection<T>(collectionName);
  const { _id: entityId, ...entityData } = entity;

  if (entityId) {
    const updatedEntity = await collection.findOneAndUpdate(
      { _id: new ObjectId(entityId) as Filter<T> },
      { $set: entityData as Partial<T> },
      { returnDocument: "after" }
    );
    if (!updatedEntity) {
      throw new DataError(404, `${collectionName}: entitiy id: '${entity._id}' not found`);
    }
    return updatedEntity;
  } else {
    const result = await collection.insertOne(entity as OptionalUnlessRequiredId<T>);
    return { ...entity, _id: result.insertedId } as WithId<T>;
  }
}
