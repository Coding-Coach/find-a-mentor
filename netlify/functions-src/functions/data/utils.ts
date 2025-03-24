import { ObjectId, type Filter, type OptionalUnlessRequiredId, type WithId } from 'mongodb';
import { getCollection } from '../utils/db';
import type { EntityPayload } from './types';
import { DataError } from './errors';

export async function upsertEntity<T extends WithId<unknown>>(collectionName: string, entity: EntityPayload<T>): Promise<WithId<T>> {
  const collection = getCollection<T>(collectionName);

  if (entity._id) {
    const updatedEntity = await collection.findOneAndUpdate(
      { _id: new ObjectId(entity._id) as Filter<T> },
      { $set: entity as Partial<T> },
      { returnDocument: "after" }
    );
    if (!updatedEntity) {
      throw new DataError(404, `${collectionName}'s ${entity._id} is not found`);
    }
    return updatedEntity;
  } else {
    const result = await collection.insertOne(entity as OptionalUnlessRequiredId<T>);
    return { ...entity, _id: result.insertedId } as WithId<T>;
  }
}
