import ApiService from './api';
import { report } from './ga';
const LOCAL_FAV_KEY = 'favs';

export function toggleFavMentor(mentor, favs) {
  const favIndex = favs.indexOf(mentor._id);

  if (favIndex > -1) {
    favs.splice(favIndex, 1);
  } else {
    favs.push(mentor._id);
  }
  ApiService.addMentorToFavorites(mentor._id);
  return favs;
}

export function get() {
  return ApiService.getFavorites();
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

export function updateFavMentorsForUser(mentors) {
  let timeOut = 0;
  mentors.forEach(mentorId => {
    setTimeout(
      mentorId => {
        ApiService.addMentorToFavorites(mentorId);
      },
      timeOut,
      mentorId
    );
    timeOut += 300;
  });
}
