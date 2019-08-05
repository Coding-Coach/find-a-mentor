import auth from '../utils/auth';
import { report } from '../ga';
const paths = {
  MENTORS: '/mentors',
  USERS: '/users',
};

const apiHost = window.location.href.includes('localhost')
  ? 'https://api-staging.codingcoach.io'
  : 'http://api.codingcoach.io/';

let currentUser;
const USER_LOCAL_KEY = 'user';

export async function makeApiCall(path, body, method) {
  const url = `${apiHost}${path}`;
  const options = {
    mode: 'cors',
    method,
    body: body && JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${auth.getIdToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  try {
    const data = await fetch(url, options).catch(error => {
      return new Error(JSON.stringify(error));
    });

    if (data instanceof Error) {
      throw data;
    }
    const res = await data.json();
    if (res.statusCode >= 400) {
      return {
        success: false,
        message: res.message,
      };
    }
    return res;
  } catch (error) {
    report('api', path, error);
    console.error(error);
    return {
      success: false,
      message: error,
    };
  }
}

async function fetchCurrentItem() {
  currentUser = await makeApiCall(`${paths.USERS}/current`).then(
    res => res && res.data
  );
  localStorage.setItem(USER_LOCAL_KEY, JSON.stringify(currentUser))
}

export async function getCurrentUser() {
  if (!currentUser && auth.isAuthenticated()) {
    const userFromLocal = localStorage.getItem(USER_LOCAL_KEY);
    if (userFromLocal) {
      currentUser = JSON.parse(userFromLocal);
      // in meantime, fetch the real user
      fetchCurrentItem();
    } else {
      await fetchCurrentItem();
    }
  }
  return currentUser;
}

export function clearCurrentUser() {
  currentUser = null;
  localStorage.removeItem(USER_LOCAL_KEY);
}

export async function getMentors() {
  // return require('../mentors.json');
  const res = await makeApiCall(paths.MENTORS);
  return res.data;
}

export async function createApplication() {
  const res = await makeApiCall(
    `${paths.MENTORS}/applications`,
    { description: 'why not?', status: 'Pending' },
    'POST'
  );
  return res;
}

export async function updateMentor(mentor) {
  const res = await makeApiCall(`${paths.USERS}/${mentor._id}`, mentor, 'PUT');
  return res.success;
}

export async function deleteMentor(mentor) {
  const res = await makeApiCall(`${paths.USERS}/${mentor._id}`, null, 'DELETE');
  return res.success;
}

export async function getPendingApplications() {
  const res = await makeApiCall(
    `${paths.MENTORS}/applications?status=pending`,
    null,
    'GET'
  );
  return res.data;
}

export async function approveApplication(mentor) {
  const res = await makeApiCall(
    `${paths.MENTORS}/applications/${mentor._id}`,
    {
      status: 'Approved'
    },
    'PUT'
  );
  return res.success;
}
