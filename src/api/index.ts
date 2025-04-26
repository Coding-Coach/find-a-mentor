import { reportError } from '../ga';
import { toast } from 'react-toastify';
import messages from '../messages';
import shuffle from 'lodash/shuffle';
import partition from 'lodash/partition';
import { Application, Mentor, User, MentorshipRequest } from '../types/models';
import Auth from '../utils/auth';
import { setPersistData } from '../persistData';

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
  auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth
  }

  getAuthorizationHeader(): HeadersInit {
    const token = this.auth?.getIdToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  getContentTypeHeader(jsonous: boolean): HeadersInit {
    return jsonous ? { 'Content-Type': 'application/json' } : {};
  }

  makeApiCall = async <T>(
    path: string,
    body?: Record<string, any> | string | null,
    method: RequestMethod = 'GET',
    jsonous = true
  ): Promise<OkResponse<T> | ErrorResponse | null> => {
    // public url for ssr
    const url = `${process.env.NEXT_PUBLIC_PUBLIC_URL}/.netlify/functions${path}${
      method === 'GET' && body ? `?${new URLSearchParams(body)}` : ''
    }`;
    const optionBody = jsonous
      ? body && JSON.stringify(body)
      : (body as FormData);

    const optionHeader: HeadersInit = {
      ...this.getAuthorizationHeader(),
      ...this.getContentTypeHeader(jsonous),
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
    if (!this.auth.isAuthenticated()) {
      this.clearCurrentUser();
      return null;
    }
    const currentUserResponse = await this.makeApiCall<User>(`${paths.USERS}/current`)
    if (currentUserResponse?.success) {
      return currentUserResponse.data;
    }
  }

  clearCurrentUser = () => {
    currentUser = undefined;
    ApiService.clearCurrentUserFromStorage();
  }

  // because we need to call it from authContext which doesn't have access to ApiService
  static clearCurrentUserFromStorage = () => {
    // TODO: use persistData
    // eslint-disable-next-line no-restricted-syntax
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

  upsertApplication = async () => {
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
      `${paths.USERS}`,
      mentor,
      'PUT'
    );
    return !!response?.success;
  }

  // no need. we're using gravatar now
  // updateMentorAvatar = async (mentor: Mentor, value: FormData) => {
  //   const response = await this.makeApiCall(
  //     `${paths.USERS}/${mentor._id}/avatar`,
  //     value,
  //     'POST',
  //     false
  //   );
  //   if (response?.success) {
  //     await this.fetchCurrentItem();
  //   }
  //   return currentUser!;
  // }

  // TODO: do we need this? I think we have a general user update
  // updateMentorAvailability = async (isAvailable: boolean) => {
  //   let currentUser = (await this.getCurrentUser())!;
  //   const userID = currentUser._id;
  //   const response = await this.makeApiCall(
  //     `${paths.USERS}/${userID}`,
  //     { available: isAvailable },
  //     'PUT'
  //   );
  //   if (response?.success) {
  //     this.storeUserInLocalStorage({ ...currentUser, available: isAvailable });
  //   }
  //   return !!response?.success;
  // }

  deleteMentor = async (mentorId: string) => {
    const response = await this.makeApiCall(
      `${paths.USERS}/`,
      null,
      'DELETE'
    );
    return !!response?.success;
  }

  getPendingApplications = async () => {
    const applicationStatus: Application['status'] = 'Pending';
    const response = await this.makeApiCall<Application[]>(
      `${paths.MENTORS}/applications?status=${applicationStatus}`,
      null,
      'GET'
    );
    return response?.success ? response.data : [];
  }

  respondApplication = async ({_id, ...applicationData}: Application) => {
    const response = await this.makeApiCall(
      `${paths.MENTORS}/applications/${_id}`,
      applicationData,
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
    setPersistData('mentorship-request', payload);
    return response;
  }

  getMyMentorshipApplication = () => {
    // TODO: use persistData
    // eslint-disable-next-line no-restricted-syntax
    return JSON.parse(localStorage.getItem(USER_MENTORSHIP_REQUEST) || '{}');
  }

  getMentorshipRequests = async (userId: string) => {
    const response = await this.makeApiCall<MentorshipRequest[]>(
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

  fetchCurrentItem = async () => {

  }

  resendVerificationEmail = async () => {
    return this.makeApiCall(`${paths.USERS}/verify`, null, 'POST');
  }
}
