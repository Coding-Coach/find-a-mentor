import { toggleAvatarHandler, ToggleAvatarRequest } from './toggleAvatar';
import { getCollection } from '../../utils/db';
import { ObjectId } from 'mongodb';
import { AuthContext, HandlerEventWithBody, AuthUser } from '../../types';
import { HandlerContext, HandlerEvent } from '@netlify/functions';

jest.mock('../../utils/db');

interface ExtendedAuthUser extends AuthUser {
  email_verified?: boolean;
  picture?: string;
}

describe('toggleAvatarHandler', () => {
  const collectionMock = {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };

  const baseEvent: HandlerEvent = {
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '',
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    rawQuery: '',
    rawUrl: '',
  };

  const baseContext: HandlerContext = {
    callbackWaitsForEmptyEventLoop: true,
    functionName: 'toggleAvatar',
    functionVersion: '1',
    invokedFunctionArn: '',
    memoryLimitInMB: '128',
    awsRequestId: '',
    logGroupName: '',
    logStreamName: '',
    getRemainingTimeInMillis: () => 0,
    done: () => {},
    fail: () => {},
    succeed: () => {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // In Jest 26, fulfilling a complex interface like Collection without casting is impossible.
    // We use a single centralized cast here to satisfy the requirement as much as possible.
    const mocked = getCollection as unknown as jest.Mock;
    mocked.mockReturnValue(collectionMock);
  });

  it('should return email_verified in the response', async () => {
    const mockId = new ObjectId();
    const mockUser = {
      _id: mockId,
      email: 'test@example.com',
      auth0Id: 'google-oauth2|123',
    };

    collectionMock.findOne.mockResolvedValue(mockUser);
    collectionMock.findOneAndUpdate.mockResolvedValue(mockUser);

    const event: HandlerEventWithBody<ToggleAvatarRequest> = {
      ...baseEvent,
      parsedBody: { useGravatar: true },
    };

    const context: AuthContext<ExtendedAuthUser> = {
      ...baseContext,
      user: {
        auth0Id: 'google-oauth2|123',
        email_verified: true,
        picture: 'https://google.com/pic.jpg',
      },
    };

    const response = await toggleAvatarHandler(event, context);
    const body = JSON.parse(response.body || '{}');

    expect(response.statusCode).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toMatchObject({
      email_verified: true,
    });
  });

  it('should return false for email_verified if it is false in context', async () => {
    const mockId = new ObjectId();
    const mockUser = {
      _id: mockId,
      email: 'test@example.com',
      auth0Id: 'google-oauth2|123',
    };

    collectionMock.findOne.mockResolvedValue(mockUser);
    collectionMock.findOneAndUpdate.mockResolvedValue(mockUser);

    const event: HandlerEventWithBody<ToggleAvatarRequest> = {
      ...baseEvent,
      parsedBody: { useGravatar: true },
    };

    const context: AuthContext<ExtendedAuthUser> = {
      ...baseContext,
      user: {
        auth0Id: 'google-oauth2|123',
        email_verified: false,
        picture: 'https://google.com/pic.jpg',
      },
    };

    const response = await toggleAvatarHandler(event, context);
    const body = JSON.parse(response.body || '{}');

    expect(body.data.email_verified).toBe(false);
  });

  it('should return undefined for email_verified if it is missing in context', async () => {
    const mockId = new ObjectId();
    const mockUser = {
      _id: mockId,
      email: 'test@example.com',
      auth0Id: 'google-oauth2|123',
    };

    collectionMock.findOne.mockResolvedValue(mockUser);
    collectionMock.findOneAndUpdate.mockResolvedValue(mockUser);

    const event: HandlerEventWithBody<ToggleAvatarRequest> = {
      ...baseEvent,
      parsedBody: { useGravatar: true },
    };

    const context: AuthContext<ExtendedAuthUser> = {
      ...baseContext,
      user: {
        auth0Id: 'google-oauth2|123',
        picture: 'https://google.com/pic.jpg',
      },
    };

    const response = await toggleAvatarHandler(event, context);
    const body = JSON.parse(response.body || '{}');

    expect(body.data.email_verified).toBeUndefined();
  });
});
