import axios from 'axios';
import { URL } from 'url';
import config from '../../../config';
import type { AvatarCheck, AvatarCheckStatus } from '../types';

const VISION_ENDPOINT = 'https://vision.googleapis.com/v1/images:annotate';
// Same threshold as the client-side detector (useFaceDetection)
const MIN_DETECTION_CONFIDENCE = 0.5;
// Netlify functions time out after 10s by default, don't let this check use it all
const REQUEST_TIMEOUT_MS = 4000;

type VisionResponse = {
  responses?: Array<{
    faceAnnotations?: Array<{ detectionConfidence?: number }>;
    error?: { code?: number; message?: string };
  }>;
};

// Vision fetches the image itself, so this only has to filter out junk
export const isCheckableAvatarUrl = (avatarUrl?: string): avatarUrl is string => {
  if (!avatarUrl) {
    return false;
  }

  try {
    const { protocol, username, password, hostname } = new URL(avatarUrl);
    const isIpLiteral = /^[\d.]+$/.test(hostname) || hostname.startsWith('[');

    return (
      protocol === 'https:' &&
      !username &&
      !password &&
      hostname.includes('.') &&
      !isIpLiteral
    );
  } catch {
    return false;
  }
};

// Vision answers `{}` (no faceAnnotations) for an image without faces
export const parseFaceDetectionResponse = (
  data?: VisionResponse
): AvatarCheckStatus => {
  const result = data?.responses?.[0];
  if (!result || result.error) {
    return 'unknown';
  }

  const hasFace = (result.faceAnnotations ?? []).some(
    ({ detectionConfidence = 0 }) =>
      detectionConfidence >= MIN_DETECTION_CONFIDENCE
  );

  return hasFace ? 'face' : 'no-face';
};

/**
 * Best-effort: never throws. Anything that stops us from getting an answer
 * (no API key, unusable URL, timeout, API error) resolves to 'unknown'.
 */
export const checkAvatar = async (avatarUrl?: string): Promise<AvatarCheck> => {
  const checkedAt = new Date();
  const apiKey = config.googleVision.API_KEY;

  if (!apiKey || !isCheckableAvatarUrl(avatarUrl)) {
    return { status: 'unknown', checkedAt };
  }

  try {
    const { data } = await axios.post<VisionResponse>(
      VISION_ENDPOINT,
      {
        requests: [
          {
            image: { source: { imageUri: avatarUrl } },
            features: [{ type: 'FACE_DETECTION', maxResults: 1 }],
          },
        ],
      },
      {
        // header rather than ?key= so the key doesn't end up in URLs or logs
        headers: { 'x-goog-api-key': apiKey },
        timeout: REQUEST_TIMEOUT_MS,
      }
    );

    return { status: parseFaceDetectionResponse(data), avatarUrl, checkedAt };
  } catch (e) {
    // Log the message only, the full axios error includes the request headers (API key)
    console.error(
      'Avatar face check failed:',
      e instanceof Error ? e.message : e
    );
    return { status: 'unknown', avatarUrl, checkedAt };
  }
};
