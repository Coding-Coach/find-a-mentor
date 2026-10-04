import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

const MEDIAPIPE_WASM_PATH =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm';
const FACE_DETECTOR_MODEL_PATH =
  'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite';

type FaceDetectionStatus = 'idle' | 'checking' | 'detected' | 'not-detected' | 'error';

export type UseFaceDetectionResult = {
  status: FaceDetectionStatus;
  faceDetected: boolean | null;
  isChecking: boolean;
};

// Module-level cache so the FaceDetector is initialised only once per session
let faceDetectorPromise: Promise<import('@mediapipe/tasks-vision').FaceDetector> | null = null;

async function getFaceDetector() {
  if (!faceDetectorPromise) {
    faceDetectorPromise = (async () => {
      const { FaceDetector, FilesetResolver } = await import(
        '@mediapipe/tasks-vision'
      );
      const filesetResolver = await FilesetResolver.forVisionTasks(
        MEDIAPIPE_WASM_PATH
      );
      return FaceDetector.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: FACE_DETECTOR_MODEL_PATH,
          delegate: 'CPU',
        },
        runningMode: 'IMAGE',
        minDetectionConfidence: 0.5,
      });
    })();
  }
  return faceDetectorPromise;
}

export function useFaceDetection(
  imageRef: RefObject<HTMLImageElement>
): UseFaceDetectionResult {
  const [status, setStatus] = useState<FaceDetectionStatus>('idle');
  // Track the src we last successfully checked to avoid redundant re-runs
  const lastCheckedSrc = useRef<string>('');

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;

    const runDetection = async (targetImg: HTMLImageElement) => {
      const src = targetImg.src;
      if (!src || src === lastCheckedSrc.current) return;

      setStatus('checking');
      try {
        const detector = await getFaceDetector();
        const result = detector.detect(targetImg);
        // Only update lastCheckedSrc after a successful detection so that
        // a src change during an in-flight check is not silently dropped
        lastCheckedSrc.current = src;
        setStatus(result.detections.length > 0 ? 'detected' : 'not-detected');
      } catch {
        // Fail silently (e.g. CORS, network) – don't block the user
        setStatus('error');
      }
    };

    const handleLoad = () => runDetection(img);

    if (img.complete && img.naturalWidth > 0) {
      // Image already loaded — run detection immediately.
      // lastCheckedSrc starts as '' so first run is always triggered.
      runDetection(img);
    } else {
      img.addEventListener('load', handleLoad);
    }

    // Always return a cleanup that removes the listener (no-op if not added)
    return () => img.removeEventListener('load', handleLoad);
  }, [imageRef]);

  return {
    status,
    faceDetected: status === 'detected' ? true : status === 'not-detected' ? false : null,
    isChecking: status === 'checking',
  };
}
