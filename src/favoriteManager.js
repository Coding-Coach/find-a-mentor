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

export async function readAndUpdateFavMentorsFromLocalStorage(){
  let isMentorListUpdated = false;
  const favsFromLocal = window.localStorage.getItem(LOCAL_FAV_KEY);
  if (favsFromLocal) {
    isMentorListUpdated = true;
    const favMentorsFromLocalStorage = JSON.parse(favsFromLocal);
    window.localStorage.removeItem(LOCAL_FAV_KEY);

    let timeOut = 0;
    let updateFavoritesPromises = [];

    favMentorsFromLocalStorage.forEach((mentorId) => {
      const updateFavoritePromise = new Promise((resolve, reject) => {
          setTimeout(async (mentorId)=>{
            const res = await addMentorToFavorites(mentorId);
            resolve(res);
          }, timeOut, mentorId);
      })
      updateFavoritesPromises.push(updateFavoritePromise);
      timeOut += 300;
    });
    await Promise.all(updateFavoritesPromises).then((values) => console.log(values));
  }
  return isMentorListUpdated;
}
