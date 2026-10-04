import axios from 'axios';
import config from '../../../config';
import {
  checkAvatar,
  isCheckableAvatarUrl,
  parseFaceDetectionResponse,
} from './avatarCheck';

// factory mocks: jest 26 can't load axios 1.x's ESM entry, and we never want a real request here
jest.mock('axios', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

jest.mock('../../../config', () => ({
  __esModule: true,
  default: { googleVision: { API_KEY: 'test-key' } },
}));

const post = axios.post as unknown as jest.Mock;
const avatarUrl = 'https://www.gravatar.com/avatar/abc123?s=200&d=identicon';

describe('parseFaceDetectionResponse', () => {
  it('returns face when a face is detected with enough confidence', () => {
    expect(
      parseFaceDetectionResponse({
        responses: [{ faceAnnotations: [{ detectionConfidence: 0.92 }] }],
      })
    ).toBe('face');
  });

  it('returns no-face when the only detection is below the threshold', () => {
    expect(
      parseFaceDetectionResponse({
        responses: [{ faceAnnotations: [{ detectionConfidence: 0.2 }] }],
      })
    ).toBe('no-face');
  });

  it('returns no-face for the empty object Vision sends when there are no faces', () => {
    expect(parseFaceDetectionResponse({ responses: [{}] })).toBe('no-face');
  });

  it('returns unknown when Vision reports an error for the image', () => {
    expect(
      parseFaceDetectionResponse({
        responses: [{ error: { code: 3, message: 'Bad image data' } }],
      })
    ).toBe('unknown');
  });

  it('returns unknown when there is no usable response', () => {
    expect(parseFaceDetectionResponse(undefined)).toBe('unknown');
    expect(parseFaceDetectionResponse({ responses: [] })).toBe('unknown');
  });
});

describe('isCheckableAvatarUrl', () => {
  it('accepts a plain https url', () => {
    expect(isCheckableAvatarUrl(avatarUrl)).toBe(true);
  });

  it.each([
    undefined,
    '',
    'not a url',
    'http://www.gravatar.com/avatar/abc',
    'https://user:pass@www.gravatar.com/avatar/abc',
    'https://localhost/avatar.png',
    'https://127.0.0.1/avatar.png',
    'https://[::1]/avatar.png',
  ])('rejects %p', (url) => {
    expect(isCheckableAvatarUrl(url as string | undefined)).toBe(false);
  });
});

describe('checkAvatar', () => {
  beforeEach(() => {
    post.mockReset();
    config.googleVision.API_KEY = 'test-key';
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('skips the request and returns unknown when no API key is configured', async () => {
    config.googleVision.API_KEY = undefined;

    const result = await checkAvatar(avatarUrl);

    expect(result.status).toBe('unknown');
    expect(post).not.toHaveBeenCalled();
  });

  it('skips the request and returns unknown for an unusable url', async () => {
    const result = await checkAvatar('http://example.com/a.png');

    expect(result.status).toBe('unknown');
    expect(post).not.toHaveBeenCalled();
  });

  it('sends the avatar url to Vision and maps the answer', async () => {
    post.mockResolvedValue({
      data: { responses: [{ faceAnnotations: [{ detectionConfidence: 0.99 }] }] },
    });

    const result = await checkAvatar(avatarUrl);

    expect(result).toMatchObject({ status: 'face', avatarUrl });
    expect(post).toHaveBeenCalledTimes(1);
    const [, body, requestConfig] = post.mock.calls[0];
    expect(body.requests[0].image.source.imageUri).toBe(avatarUrl);
    expect(requestConfig.headers['x-goog-api-key']).toBe('test-key');
  });

  it('returns no-face when Vision finds nothing', async () => {
    post.mockResolvedValue({ data: { responses: [{}] } });

    const result = await checkAvatar(avatarUrl);

    expect(result.status).toBe('no-face');
  });

  it('resolves to unknown instead of throwing when the request fails', async () => {
    post.mockRejectedValue(new Error('timeout of 4000ms exceeded'));

    const result = await checkAvatar(avatarUrl);

    expect(result.status).toBe('unknown');
  });
});
