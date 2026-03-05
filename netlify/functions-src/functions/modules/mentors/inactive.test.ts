import { handler } from './inactive';
import { getCollection } from '../../utils/db';
import { HandlerEvent, HandlerContext } from '@netlify/functions';
import { AuthContext } from '../../types';

jest.mock('../../utils/db');

const baseEvent: HandlerEvent = {
  body: null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: 'GET',
  isBase64Encoded: false,
  path: '/mentors/inactive',
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  rawQuery: '',
  rawUrl: '',
};

const baseContext: AuthContext<any> = {
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
  user: { auth0Id: 'admin|123' },
};

describe('getInactiveMentorsHandler', () => {
  const projectMock = jest.fn();
  const toArrayMock = jest.fn();
  const findMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    toArrayMock.mockResolvedValue([]);
    projectMock.mockReturnValue({ toArray: toArrayMock });
    findMock.mockReturnValue({ project: projectMock });
    (getCollection as unknown as jest.Mock).mockReturnValue({ find: findMock });
  });

  it('returns a success response with an empty array when no inactive mentors exist', async () => {
    const response = await handler(baseEvent, baseContext);
    const body = JSON.parse(response.body || '{}');

    expect(response.statusCode).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
  });

  it('queries for users with Mentor role and available !== true', async () => {
    await handler(baseEvent, baseContext);

    expect(findMock).toHaveBeenCalledWith({
      roles: 'Mentor',
      available: { $ne: true },
    });
  });

  it('returns inactive mentors in the response', async () => {
    const mockMentors = [
      { _id: 'id1', name: 'Alice', email: 'alice@example.com', createdAt: new Date().toISOString() },
      { _id: 'id2', name: 'Bob', email: 'bob@example.com', createdAt: new Date().toISOString() },
    ];
    toArrayMock.mockResolvedValue(mockMentors);

    const response = await handler(baseEvent, baseContext);
    const body = JSON.parse(response.body || '{}');

    expect(response.statusCode).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual(mockMentors);
  });
});
