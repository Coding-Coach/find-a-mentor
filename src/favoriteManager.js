import { report } from './ga';
const LOCAL_FAV_KEY = 'favs';

export function toggleFavMentor(api, mentor, favs) {
  const favIndex = favs.indexOf(mentor._id);

  if (favIndex > -1) {
    favs.splice(favIndex, 1);
  } else {
    favs.push(mentor._id);
  }
  api.addMentorToFavorites(mentor._id);
  return favs;
}

export function get(api) {
  return api.getFavorites();
}

export function readFavMentorsFromLocalStorage() {
  let favMentorsFromLocalStorage = [];
  const favsFromLocal = window.localStorage.getItem(LOCAL_FAV_KEY);
  if (favsFromLocal) {
    favMentorsFromLocalStorage = JSON.parse(favsFromLocal);
    window.localStorage.removeItem(LOCAL_FAV_KEY);
    report('Favorite', 'sync');
  }
  return favMentorsFromLocalStorage;
}

export function updateFavMentorsForUser(api, mentors) {
  let timeOut = 0;
  mentors.forEach((mentorId) => {
    setTimeout(
      (mentorId) => {
        api.addMentorToFavorites(mentorId);
      },
      timeOut,
      mentorId
    );
    timeOut += 300;
  });
}
