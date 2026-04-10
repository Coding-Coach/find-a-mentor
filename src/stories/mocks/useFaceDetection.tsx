import React, { createContext, useContext } from 'react';
import type { ReactNode, RefObject } from 'react';

export type MockFaceDetectionState =
  | 'idle'
  | 'checking'
  | 'detected'
  | 'not-detected';

const FaceDetectionContext = createContext<MockFaceDetectionState>('idle');

export const FaceDetectionProvider = ({
  state,
  children,
}: {
  state: MockFaceDetectionState;
  children: ReactNode;
}) => (
  <FaceDetectionContext.Provider value={state}>
    {children}
  </FaceDetectionContext.Provider>
);

export function useFaceDetection(_imageRef: RefObject<HTMLImageElement>) {
  const state = useContext(FaceDetectionContext);

  return {
    status: state,
    faceDetected:
      state === 'detected' ? true : state === 'not-detected' ? false : null,
    isChecking: state === 'checking',
  };
}
