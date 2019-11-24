import { getFavorites, addMentorToFavorites } from './api';
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

export function get() {
  return getFavorites();
}

export function readAndUpdateFavMentorsFromLocalStorage() {
  let favMentorsFromLocalStorage = [];
  const favsFromLocal = window.localStorage.getItem(LOCAL_FAV_KEY);
  if (favsFromLocal) {
    favMentorsFromLocalStorage = JSON.parse(favsFromLocal);
    window.localStorage.removeItem(LOCAL_FAV_KEY);

    let timeOut = 0;

    favMentorsFromLocalStorage.forEach(mentorId => {
      setTimeout(
        mentorId => {
          addMentorToFavorites(mentorId);
        },
        timeOut,
        mentorId
      );
      timeOut += 300;
    });
  }
  return favMentorsFromLocalStorage;
}