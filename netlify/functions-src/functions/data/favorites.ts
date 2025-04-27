import { ObjectId } from 'mongodb';
import { getCollection } from '../utils/db';
import type { User } from '../common/interfaces/user.interface';
import { DataError } from './errors';

export interface Favorite {
  _id: ObjectId;
  userId: ObjectId;
  mentorId: ObjectId;
  createdAt: Date;
}

export const getFavorites = async (userId: ObjectId): Promise<string[]> => {
  const favoritesCollection = getCollection<Favorite>('favorites');
  const favorites = await favoritesCollection.find(
    { userId },
    { projection: { mentorId: 1 } }
  ).toArray();

  return favorites.map(fav => fav.mentorId.toString());
};

export const toggleFavorite = async (userId: ObjectId, mentorId: string): Promise<string[]> => {
  const favoritesCollection = getCollection<Favorite>('favorites');
  const mentorsCollection = getCollection<User>('users');

  // First, check if mentor exists
  const mentor = await mentorsCollection.findOne({ _id: new ObjectId(mentorId) });
  if (!mentor) {
    throw new DataError(404, 'Mentor not found');
  }

  // Try to find and remove the favorite
  const existingFavorite = await favoritesCollection.findOneAndDelete({
    userId,
    mentorId: new ObjectId(mentorId)
  });

  // If no favorite was found, create a new one
  if (!existingFavorite) {
    const favorite: Favorite = {
      _id: new ObjectId(),
      userId,
      mentorId: new ObjectId(mentorId),
      createdAt: new Date()
    };
    await favoritesCollection.insertOne(favorite);
  }

  // Return updated list of favorites
  return getFavorites(userId);
};