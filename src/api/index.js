import auth from '../utils/auth';
import { reportError } from '../ga';
import { toast } from 'react-toastify';
import messages from '../messages';
import shuffle from 'lodash/shuffle';
import * as Sentry from '@sentry/browser';

const API_ERROR_TOAST_ID = 'api-error-toast-id';
const USER_LOCAL_KEY = 'user';
const USER_MENTORSHIP_REQUEST = 'mentorship-request';

export const paths = {
  MENTORS: '/mentors',
  USERS: '/users',
  MENTORSHIP: '/mentorships',
};

let currentUser;

export async function makeApiCall(path, body, method, jsonous = true) {
  const url = `${process.env.REACT_APP_API_ENDPOINT}${path}`;
  const optionBody = jsonous ? body && JSON.stringify(body) : body;
  const optionHeader = jsonous
    ? {
        Authorization: `Bearer ${auth.getIdToken()}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    : { Authorization: `Bearer ${auth.getIdToken()}` };
  const options = {
    mode: 'cors',
    method,
    body: optionBody,
    headers: optionHeader,
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
    console.error(error);

    const errorMessage = getErrorMessage(error);
    reportError('Api', `${errorMessage || 'unknown error'} at ${path}`);

    !toast.isActive(API_ERROR_TOAST_ID) &&
      toast.error(errorMessage, {
        toastId: API_ERROR_TOAST_ID,
      });
    return {
      success: false,
      message: error,
    };
  }
}

function getErrorMessage(error) {
  if (Array.isArray(error)) {
    return Object.values(error[0].constraints)[0];
  }
  if (error) {
    return error;
  }
  return messages.GENERIC_ERROR;
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

let mentorsPromise;
export async function getMentors() {
  if (!mentorsPromise) {
    mentorsPromise = makeApiCall(`${paths.MENTORS}?limit=1200`)
      .then(response => shuffle(response?.data || []));
  }
  return mentorsPromise;
}

export async function getFavorites() {
  const { _id: userId } = await getCurrentUser();
  const res = await makeApiCall(`${paths.USERS}/${userId}/favorites`);
  if (res.success) {
    return res.data.mentors.map(mentor => mentor._id);
  }
  return [];
}

export async function addMentorToFavorites(mentorId) {
  const { _id: userId } = await getCurrentUser();
  const res = await makeApiCall(
    `${paths.USERS}/${userId}/favorites/${mentorId}`,
    {},
    'POST'
  );
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

export async function updateMentorAvatar(mentor, value) {
  const res = await makeApiCall(
    `${paths.USERS}/${mentor._id}/avatar`,
    value,
    'POST',
    false
  );
  if (res.success) {
    await fetchCurrentItem();
  }
  return currentUser;
}

export async function updateMentorAvailability(isAvailable) {
  let currentUser = await getCurrentUser();
  const userID = currentUser._id;
  const res = await makeApiCall(
    `${paths.USERS}/${userID}`,
    { available: isAvailable },
    'PUT'
  );
  if (res.success) {
    storeUserInLocalStorage({ ...currentUser, available: isAvailable });
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

export async function applyForMentorship(
  mentor,
  { background, expectation, message }
) {
  const payload = {
    background,
    expectation,
    message,
  };
  const res = await makeApiCall(
    `${paths.MENTORSHIP}/${mentor._id}/apply`,
    payload,
    'POST'
  );
  if (res.success) {
    localStorage.setItem(USER_MENTORSHIP_REQUEST, JSON.stringify(payload));
  }
  return res.success;
}

export function getMyMentorshipApplication() {
  return JSON.parse(localStorage.getItem(USER_MENTORSHIP_REQUEST) || '{}');
}

export async function getMentorshipRequests(userId) {
  const res = await makeApiCall(
    `${paths.MENTORSHIP}/${userId}/requests`,
    null,
    'GET'
  );
  return res.data;
}

export async function updateMentorshipReqStatus(reqId, userId, payload) {
  const res = await makeApiCall(
    `${paths.MENTORSHIP}/${userId}/requests/${reqId}`,
    payload,
    'PUT'
  );
  return res;
}
