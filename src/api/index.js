import auth from '../utils/auth';
const paths = {
  MENTORS: '/mentors',
  USERS: '/users'
}

const apiHost = window.location.href.includes('localhost') ? 'https://api-staging.codingcoach.io' : 'http://api.codingcoach.io/';
let currentUser;

export async function makeApiCall(path, body, method) {
  const url = `${apiHost}${path}`;
  const options = {
    mode: 'cors',
    method,
    body: body && JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${auth.getIdToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  try {
    const data = await fetch(url, options).catch(error => {
      console.error(error);
    });
    const res = await data.json();
    if (res.statusCode >= 400) {
      return {
        success: false,
        message: res.message
      }
    }
    return res;
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentUser() {
  if (!currentUser) {
    currentUser = await makeApiCall(`${paths.USERS}/current`).then(res => res.data);
  }
  return currentUser;
}

export async function getMentors() {
  const res = await makeApiCall(paths.MENTORS);
  return res.data;
}

export async function createApplication() {
  const res = await makeApiCall(`${paths.MENTORS}/applications`, {reason: 'why not?'}, 'POST');
  return res;
}

export async function updateMentor(mentor) {
  const res = await makeApiCall(`${paths.USERS}/${mentor.id}`, mentor, 'PUT');
  return res.success;
}

export async function deleteMentor(mentor) {
  const res = await makeApiCall(`${paths.USERS}/${mentor.id}`, null, 'DELETE');
  return res.success;
}