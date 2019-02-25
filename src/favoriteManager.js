export function toggle(mentor) {
  const favs = get();
  const favIndex = favs.indexOf(mentor.id);

  if (favIndex > -1) {
    favs.splice(favIndex, 1);
  } else {
    favs.push(mentor.id);
  }
  localStorage.setItem('favs', JSON.stringify(favs));
  return favs;
}

export function get() {
  return JSON.parse(localStorage.getItem('favs') || '[]');
}