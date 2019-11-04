import { getFavorites, addMentorToFavorites } from './api';

export function toggle(mentor, favs) {
  const favIndex = favs.indexOf(mentor._id);

  if (favIndex > -1) {
    favs.splice(favIndex, 1);
  } else {
    favs.push(mentor._id);
  }
  addMentorToFavorites(mentor._id);
  return favs;
}

export function get() {
  return getFavorites();
}
