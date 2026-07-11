import { handler } from './pendingActivation';
import { getCollection } from '../../utils/db';
import { HandlerContext, HandlerEvent } from '@netlify/functions';
import { AuthContext, AuthUser } from '../../types';

jest.mock('../../utils/db');

describe('pendingActivation handler', () => {
  const collectionMock = {
    find: jest.fn(),
  };

  const baseEvent: HandlerEvent = {
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'GET',
    isBase64Encoded: false,
    path: '',
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    rawQuery: '',
    rawUrl: '',
  };

  const baseContext: HandlerContext = {
    callbackWaitsForEmptyEventLoop: true,
    functionName: 'mentors',
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

  const adminContext: AuthContext<AuthUser> = {
    ...baseContext,
    user: { auth0Id: 'admin-auth0-id' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const mocked = getCollection as unknown as jest.Mock;
    mocked.mockReturnValue(collectionMock);
  });

  it('should return mentors with Mentor role who are not active', async () => {
    const mockMentors = [
      { _id: 'id1', name: 'Alice', email: 'alice@example.com', createdAt: '2024-01-01T00:00:00.000Z', roles: ['Mentor'], available: false },
      { _id: 'id2', name: 'Bob', email: 'bob@example.com', createdAt: '2024-02-01T00:00:00.000Z', roles: ['Mentor'] },
    ];

    collectionMock.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue(mockMentors) });

    const response = await handler(baseEvent, adminContext);
    const body = JSON.parse(response.body || '{}');

    expect(response.statusCode).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(2);
  });

  it('should return an empty list when all mentors are active', async () => {
    collectionMock.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue([]) });

    const response = await handler(baseEvent, adminContext);
    const body = JSON.parse(response.body || '{}');

    expect(response.statusCode).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(0);
  });
});
