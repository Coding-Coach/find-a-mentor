import auth from '../utils/auth';
import { reportError } from '../ga';
import { toast } from 'react-toastify';
import messages from '../messages';
import shuffle from 'lodash/shuffle';
import * as Sentry from '@sentry/browser';

const API_ERROR_TOAST_ID = 'api-error-toast-id';

const paths = {
  MENTORS: '/mentors',
  USERS: '/users',
};

let currentUser;
const USER_LOCAL_KEY = 'user';

export async function makeApiCall(path, body, method) {
  const url = `${process.env.REACT_APP_API_ENDPOINT}${path}`;
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
      return new Error(error);
    });

    if (data instanceof Error) {
      throw data;
    }
    const res = await data.json();
    if (res.statusCode >= 400) {
      throw res.message;
    }
    return res;
  } catch (error) {
    reportError('Api', `${error || 'unknown error'} at ${path}`);
    console.error(error);
    !toast.isActive(API_ERROR_TOAST_ID) &&
      toast.error(messages.GENERIC_ERROR, {
        toastId: API_ERROR_TOAST_ID,
      });
    return {
      success: false,
      message: error,
    };
  }
}

function storeUserInLocalStorage(user = currentUser) {
  if (user) {
    localStorage.setItem(USER_LOCAL_KEY, JSON.stringify(user));
  }
}

async function fetchCurrentItem() {
  currentUser = await makeApiCall(`${paths.USERS}/current`).then(res => {
    if (res != null) {
      Sentry.configureScope(scope => {
        scope.setUser({
          id: res.data._id,
          email: res.data.email,
          username: res.data.name,
        });
      });

      return res.data;
    }
  });
  storeUserInLocalStorage();
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
  // TODO remove prepage: 1000 once the pagination will be ready
  const res = await makeApiCall(`${paths.MENTORS}?limit=1000`);
  if (res.data) {
    return shuffle(res.data);
  }
  return [];
}

export async function getFavorites() {
  const {_id: userId} = await getCurrentUser();
  const res = await makeApiCall(`${paths.USERS}/${userId}/favorites`);
  if (res.success) {
    return res.data.mentors.map(mentor => mentor._id);
  }
  return [];
}

export async function addMentorToFavorites(mentorId) {
  const {_id: userId} = await getCurrentUser();
  const res = await makeApiCall(`${paths.USERS}/${userId}/favorites/${mentorId}`, {}, 'POST');
  return res.success;
}

async function userHasPendingApplication(user) {
  const myApplications = await makeApiCall(
    `${paths.MENTORS}/${user._id}/applications?status=pending`
  );

  return myApplications && myApplications.data && myApplications.data.length;
}

export async function createApplicationIfNotExists(user) {
  if (await userHasPendingApplication(user)) {
    return {
      success: true,
      message: messages.EDIT_DETAILS_MENTOR_SUCCESS,
    };
  }
  const res = await makeApiCall(
    `${paths.MENTORS}/applications`,
    { description: 'why not?', status: 'Pending' },
    'POST'
  );
  return {
    success: res.success,
    message: res.success
      ? messages.EDIT_DETAILS_APPLICATION_SUBMITTED
      : res.message,
  };
}

export async function updateMentor(mentor) {
  const res = await makeApiCall(`${paths.USERS}/${mentor._id}`, mentor, 'PUT');
  if (res.success) {
    storeUserInLocalStorage(mentor);
  }
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
      status: 'Approved',
    },
    'PUT'
  );
  return res.success;
}

export async function rejectApplication(mentor, reason) {
  const res = await makeApiCall(
    `${paths.MENTORS}/applications/${mentor._id}`,
    {
      status: 'Rejected',
      reason,
    },
    'PUT'
  );
  return res.success;
}
