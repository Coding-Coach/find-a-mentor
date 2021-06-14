import auth from '../utils/auth';
import { reportError } from '../ga';
import { toast } from 'react-toastify';
import messages from '../messages';
import shuffle from 'lodash/shuffle';
import * as Sentry from '@sentry/browser';
import { Application, Mentor, User } from '../types/models';

type RequestMethod = 'POST' | 'GET' | 'PUT' | 'DELETE';
type ErrorResponse = {
  success: false;
  message: string;
};
type OkResponse<T> = {
  success: true;
  data: T;
};

const API_ERROR_TOAST_ID = 'api-error-toast-id';
const USER_LOCAL_KEY = 'user';
const USER_MENTORSHIP_REQUEST = 'mentorship-request';

export const paths = {
  MENTORS: '/mentors',
  USERS: '/users',
  MENTORSHIP: '/mentorships',
};

let currentUser: User | undefined;

export async function makeApiCall<T>(
  path: string,
  body?: Record<string, any> | string | null,
  method: RequestMethod = 'GET',
  jsonous = true
): Promise<OkResponse<T> | ErrorResponse | null> {
  const url = `${process.env.REACT_APP_API_ENDPOINT}${path}`;
  const optionBody = jsonous
    ? body && JSON.stringify(body)
    : (body as FormData);
  const optionHeader: HeadersInit = {
    Authorization: `Bearer ${auth.getIdToken()}`,
    ...(jsonous
      ? {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      : {}),
  };

  const options: RequestInit = {
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

function getErrorMessage(error: { constraints: Record<string, string> }[]) {
  if (Array.isArray(error)) {
    return Object.values(error[0].constraints)[0];
  }
  if (error) {
    return error;
  }
  return messages.GENERIC_ERROR;
}

function storeUserInLocalStorage(user: User = currentUser!) {
  if (user) {
    localStorage.setItem(USER_LOCAL_KEY, JSON.stringify(user));
  }
}

async function fetchCurrentItem() {
  currentUser = await makeApiCall<User>(`${paths.USERS}/current`).then(
    response => {
      if (response?.success) {
        Sentry.configureScope(scope => {
          scope.setUser({
            id: response.data._id,
            email: response.data.email,
            username: response.data.name,
          });
        });

        return response.data;
      }
    }
  );
  storeUserInLocalStorage();
}

export async function getCurrentUser(): Promise<typeof currentUser> {
  if (!currentUser && auth.isAuthenticated()) {
    const userFromLocal = localStorage.getItem(USER_LOCAL_KEY);
    if (userFromLocal) {
      currentUser = JSON.parse(userFromLocal);
      // meantime, fetch the real user
      fetchCurrentItem();
    } else {
      await fetchCurrentItem();
    }
  }
  return currentUser;
}

export function clearCurrentUser() {
  currentUser = undefined;
  localStorage.removeItem(USER_LOCAL_KEY);
}

let mentorsPromise: Promise<Mentor[]>;

export async function getMentors() {
  if (!mentorsPromise) {
    mentorsPromise = makeApiCall<Mentor[]>(`${paths.MENTORS}?limit=1200`).then(
      response => {
        if (response?.success) {
          return shuffle(response.data || []);
        } else {
          return [];
        }
      }
    );
  }
  return mentorsPromise;
}

export async function getFavorites() {
  const { _id: userId } = (await getCurrentUser())!;
  const response = await makeApiCall<{ mentors: Mentor[] }>(
    `${paths.USERS}/${userId}/favorites`
  );
  if (response?.success) {
    return response.data.mentors.map(mentor => mentor._id);
  }
  return [];
}

export async function addMentorToFavorites(mentorId: string) {
  const { _id: userId } = (await getCurrentUser())!;

  const response = await makeApiCall(
    `${paths.USERS}/${userId}/favorites/${mentorId}`,
    {},
    'POST'
  );
  return !!response?.success;
}

async function userHasPendingApplication(user: User) {
  const response = await makeApiCall<Application[]>(
    `${paths.MENTORS}/${user._id}/applications?status=pending`
  );
  if (response?.success) {
    return response.data.length > 0;
  }

  return false;
}

export async function createApplicationIfNotExists(user: User) {
  if (await userHasPendingApplication(user)) {
    return {
      success: true,
      message: messages.EDIT_DETAILS_MENTOR_SUCCESS,
    };
  }
  const response = await makeApiCall(
    `${paths.MENTORS}/applications`,
    { description: 'why not?', status: 'Pending' },
    'POST'
  );
  return {
    success: !!response?.success,
    message: response?.success
      ? messages.EDIT_DETAILS_APPLICATION_SUBMITTED
      : response?.message,
  };
}

export async function updateMentor(mentor: Mentor) {
  const response = await makeApiCall(
    `${paths.USERS}/${mentor._id}`,
    mentor,
    'PUT'
  );
  if (response?.success) {
    storeUserInLocalStorage(mentor);
  }
  return !!response?.success;
}

export async function updateMentorAvatar(mentor: Mentor, value: FormData) {
  const response = await makeApiCall(
    `${paths.USERS}/${mentor._id}/avatar`,
    value,
    'POST',
    false
  );
  if (response?.success) {
    await fetchCurrentItem();
  }
  return currentUser!;
}

export async function updateMentorAvailability(isAvailable: boolean) {
  let currentUser = (await getCurrentUser())!;
  const userID = currentUser._id;
  const response = await makeApiCall(
    `${paths.USERS}/${userID}`,
    { available: isAvailable },
    'PUT'
  );
  if (response?.success) {
    storeUserInLocalStorage({ ...currentUser, available: isAvailable });
  }
  return !!response?.success;
}

export async function deleteMentor(mentorId: string) {
  const response = await makeApiCall(
    `${paths.USERS}/${mentorId}`,
    null,
    'DELETE'
  );
  return !!response?.success;
}

export async function getPendingApplications() {
  const response = await makeApiCall<Application[]>(
    `${paths.MENTORS}/applications?status=pending`,
    null,
    'GET'
  );
  return response?.success ? response.data : [];
}

export async function approveApplication(mentor: Mentor) {
  const response = await makeApiCall(
    `${paths.MENTORS}/applications/${mentor._id}`,
    {
      status: 'Approved',
    },
    'PUT'
  );
  return !!response?.success;
}

export async function declineApplication(mentor: Mentor, reason: string) {
  const response = await makeApiCall(
    `${paths.MENTORS}/applications/${mentor._id}`,
    {
      status: 'Rejected',
      reason,
    },
    'PUT'
  );
  return !!response?.success;
}

export async function applyForMentorship(
  mentor: Mentor,
  {
    background,
    expectation,
    message,
  }: { background: string; expectation: string; message: string }
) {
  const payload = {
    background,
    expectation,
    message,
  };
  const response = await makeApiCall(
    `${paths.MENTORSHIP}/${mentor._id}/apply`,
    payload,
    'POST'
  );
  if (response?.success) {
    localStorage.setItem(USER_MENTORSHIP_REQUEST, JSON.stringify(payload));
  }
  return !!response?.success;
}

export function getMyMentorshipApplication() {
  return JSON.parse(localStorage.getItem(USER_MENTORSHIP_REQUEST) || '{}');
}

export async function getMentorshipRequests(userId: string) {
  const response = await makeApiCall(
    `${paths.MENTORSHIP}/${userId}/requests`,
    null,
    'GET'
  );
  return response?.success ? response.data : [];
}

export async function updateMentorshipReqStatus(
  requestId: string,
  userId: string,
  payload: {
    status: string;
    reason: string;
  }
) {
  const res = await makeApiCall(
    `${paths.MENTORSHIP}/${userId}/requests/${requestId}`,
    payload,
    'PUT'
  );
  return res;
}
