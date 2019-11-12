import { getFavorites, addMentorToFavorites } from './api';
import { timeout, Promise } from 'q';
const LOCAL_FAV_KEY = "favs";

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

export async function get() {
  await readAndUpdateMentorsFromLocalStorage();
  return getFavorites();
}

export function readAndUpdateMentorsFromLocalStorage(){
  const mentorList = `["5d5d6372f4fcfc765924b7f3", "5d5d6372f4fcfc765924b7d5", "5d5d6373f4fcfc765924b992",
  "5d5d6373f4fcfc765924bb75", "5d5d6373f4fcfc765924bb26", "5d5d6373f4fcfc765924bb65"]`;
  window.localStorage.setItem(LOCAL_FAV_KEY, mentorList);
  const favsFromLocal = window.localStorage.getItem(LOCAL_FAV_KEY);
  if (favsFromLocal) {
    const favMentorsFromLocalStorage = JSON.parse(favsFromLocal);

    let updateRequestPromises = [];
    window.localStorage.removeItem(LOCAL_FAV_KEY);
    favMentorsFromLocalStorage.forEach((mentorId) => {
      updateRequestPromises.push(addMentorToFavorites(mentorId));
    });
    return Promise.all(updateRequestPromises);
  }
}
