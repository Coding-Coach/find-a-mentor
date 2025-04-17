import { MongoClient, Db, Document } from 'mongodb'
import type { CollectionName } from '../data/types'

let cachedDb: Db | null = null
let client: MongoClient | null = null

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable')
  }

  if (!process.env.MONGODB_DB) {
    throw new Error('Please define the MONGODB_DB environment variable')
  }

  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
  }

  const db = client.db(process.env.MONGODB_DB)
  cachedDb = db

  return db
}

// can't run transactions on a sharded cluster
// export const startSession = () => {
//   if (!client) {
//     throw new Error('Database client not connected. Have you remembered to call connectToDatabase()?')
//   }
//   return client.startSession()
// }

// Helper function to get a collection with proper typing
export const getCollection = <T extends Document>(collectionName: CollectionName) => {
  if (!cachedDb) {
    throw new Error('Database not connected. Have you remembered to wrap your function with withDB?.')
  }
  return cachedDb.collection<T>(collectionName)
}