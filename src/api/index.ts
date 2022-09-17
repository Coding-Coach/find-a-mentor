import { reportError } from '../ga';
import { toast } from 'react-toastify';
import messages from '../messages';
import shuffle from 'lodash/shuffle';
import partition from 'lodash/partition';
import * as Sentry from '@sentry/browser';
import { Application, Mentor, User } from '../types/models';
import { setVisitor } from '../utils/tawk';

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
  ADMIN: '/admin',
};

let currentUser: User | undefined;

export default class ApiService {
  mentorsPromise: Promise<Mentor[]> | null = null
  auth: any

  constructor(auth: any) {
    this.auth = auth
  }

  makeApiCall = async <T>(
    path: string,
    body?: Record<string, any> | string | null,
    method: RequestMethod = 'GET',
    jsonous = true
  ): Promise<OkResponse<T> | ErrorResponse | null> => {
    const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}${path}${
      method === 'GET' && body ? `?${new URLSearchParams(body)}` : ''
    }`;
    const optionBody = jsonous
      ? body && JSON.stringify(body)
      : (body as FormData);
    const optionHeader: HeadersInit = {
      Authorization: `Bearer ${this.auth.getIdToken()}`,
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
      body: method === 'GET' ? null : optionBody,
      headers: optionHeader,
    };

    try {
      const data = await fetch(url, options).catch((error) => {
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
      // eslint-disable-next-line no-console
      console.error(error);

      const errorMessage = this.getErrorMessage(error);
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

  getCurrentUser = async (): Promise<typeof currentUser> => {
    if (!currentUser && this.auth.isAuthenticated()) {
      const userFromLocal = localStorage.getItem(USER_LOCAL_KEY);
      if (userFromLocal) {
        currentUser = JSON.parse(userFromLocal);
        // meantime, fetch the real user
        this.fetchCurrentItem();
      } else {
        await this.fetchCurrentItem();
      }
    }
    return currentUser;
  }

  clearCurrentUser = () => {
    currentUser = undefined;
    localStorage.removeItem(USER_LOCAL_KEY);
  }

  getMentors = async () => {
    if (!this.mentorsPromise) {
      this.mentorsPromise = this.makeApiCall<Mentor[]>(`${paths.MENTORS}?limit=1300&available=true`).then(
        (response) => {
          if (response?.success) {
            const [available, unavailable] = partition(
              response.data || [],
              (mentor) => mentor.available
            );
            return [...shuffle(available), ...unavailable];
          } else {
            return [];
          }
        }
      );
    }
    return this.mentorsPromise;
  }

  getUser = async (userId: string) => {
    if (this.mentorsPromise != null) {
      const mentors = await this.mentorsPromise;
      const mentor = mentors.find((mentor) => mentor._id === userId);
      if (mentor) {
        return mentor;
      }
    }
    const response = await this.makeApiCall<User>(`${paths.USERS}/${userId}`);
    if (response?.success) {
      return response.data;
    }
    return null;
  }

  getFavorites = async () => {
    const { _id: userId } = (await this.getCurrentUser())!;

    const response = await this.makeApiCall<{ mentors: Mentor[] }>(
      `${paths.USERS}/${userId}/favorites`
    );
    if (response?.success) {
      return response.data.mentors.map((mentor) => mentor._id);
    }
    return [];
  }

  addMentorToFavorites = async (mentorId: string) => {
      const { _id: userId } = (await this.getCurrentUser())!;

    const response = await this.makeApiCall(
      `${paths.USERS}/${userId}/favorites/${mentorId}`,
      {},
      'POST'
    );
    return !!response?.success;
  }

  createApplicationIfNotExists = async (user: User) => {
    if (await this.userHasPendingApplication(user)) {
      return {
        success: true,
        message: messages.EDIT_DETAILS_MENTOR_SUCCESS,
      };
    }
    const response = await this.makeApiCall(
      `${paths.MENTORS}/applications`,
      { description: 'why not?', status: 'Pending' },
      'POST'
    );

    const success = response?.success === true;
    return {
      success,
      message: success
        ? messages.EDIT_DETAILS_APPLICATION_SUBMITTED
        : response?.message,
    };
  }

  updateMentor = async (mentor: Mentor) => {
    const response = await this.makeApiCall(
      `${paths.USERS}/${mentor._id}`,
      mentor,
      'PUT'
    );
    if (response?.success) {
      this.storeUserInLocalStorage(mentor);
    }
    return !!response?.success;
  }

  updateMentorAvatar = async (mentor: Mentor, value: FormData) => {
    const response = await this.makeApiCall(
      `${paths.USERS}/${mentor._id}/avatar`,
      value,
      'POST',
      false
    );
    if (response?.success) {
      await this.fetchCurrentItem();
    }
    return currentUser!;
  }

  updateMentorAvailability = async (isAvailable: boolean) => {
    let currentUser = (await this.getCurrentUser())!;
    const userID = currentUser._id;
    const response = await this.makeApiCall(
      `${paths.USERS}/${userID}`,
      { available: isAvailable },
      'PUT'
    );
    if (response?.success) {
      this.storeUserInLocalStorage({ ...currentUser, available: isAvailable });
    }
    return !!response?.success;
  }

  deleteMentor = async (mentorId: string) => {
    const response = await this.makeApiCall(
      `${paths.USERS}/${mentorId}`,
      null,
      'DELETE'
    );
    return !!response?.success;
  }

  getPendingApplications = async () => {
    const response = await this.makeApiCall<Application[]>(
      `${paths.MENTORS}/applications?status=pending`,
      null,
      'GET'
    );
    return response?.success ? response.data : [];
  }

  approveApplication = async (mentor: Mentor) => {
    const response = await this.makeApiCall(
      `${paths.MENTORS}/applications/${mentor._id}`,
      {
        status: 'Approved',
      },
      'PUT'
    );
    return !!response?.success;
  }

  declineApplication = async (mentor: Mentor, reason: string) => {
    const response = await this.makeApiCall(
      `${paths.MENTORS}/applications/${mentor._id}`,
      {
        status: 'Rejected',
        reason,
      },
      'PUT'
    );
    return !!response?.success;
  }

  applyForMentorship = async (
    mentor: Mentor,
    {
      background,
      expectation,
      message,
    }: { background: string; expectation: string; message: string }
  ) => {
    const payload = {
      background,
      expectation,
      message,
    };
    const response = await this.makeApiCall(
      `${paths.MENTORSHIP}/${mentor._id}/apply`,
      payload,
      'POST'
    );
    if (response?.success) {
      localStorage.setItem(USER_MENTORSHIP_REQUEST, JSON.stringify(payload));
    }
    return !!response?.success;
  }

  getMyMentorshipApplication = () => {
    return JSON.parse(localStorage.getItem(USER_MENTORSHIP_REQUEST) || '{}');
  }

  getMentorshipRequests = async (userId: string) => {
    const response = await this.makeApiCall(
      `${paths.MENTORSHIP}/${userId}/requests`,
      null,
      'GET'
    );
    const apiOrder = response?.success ? response.data : [];
    return apiOrder.reverse();
  }

  updateMentorshipReqStatus = async (
    requestId: string,
    userId: string,
    payload: {
      status: string;
      reason: string;
    }
  ) => {
    const res = await this.makeApiCall(
      `${paths.MENTORSHIP}/${userId}/requests/${requestId}`,
      payload,
      'PUT'
    );
    return res;
  }

  // Private methods
  getErrorMessage = (error: { constraints: Record<string, string> }[]) => {
    if (Array.isArray(error)) {
      return Object.values(error[0].constraints)[0];
    }
    if (error) {
      return error;
    }
    return messages.GENERIC_ERROR;
  }

  storeUserInLocalStorage = (user: User = currentUser!) => {
    if (user) {
      localStorage.setItem(USER_LOCAL_KEY, JSON.stringify(user));
    }
  }

  fetchCurrentItem = async () => {
    currentUser = await this.makeApiCall<User>(`${paths.USERS}/current`).then(
      (response) => {
        if (response?.success) {
          const { _id, email, name, roles } = response.data || {};
          if (!_id) {
            return;
          }

          Sentry.configureScope((scope) => {
            scope.setUser({
              email,
              id: _id,
              username: name,
            });
          });

          setVisitor({
            name,
            email,
            roles,
          });

          return response.data;
        }
      }
    );
    this.storeUserInLocalStorage();
  }

  userHasPendingApplication = async (user: User) => {
    const response = await this.makeApiCall<Application[]>(
      `${paths.MENTORS}/${user._id}/applications?status=pending`
    );
    if (response?.success) {
      return response.data.length > 0;
    }

    return false;
  }
}
