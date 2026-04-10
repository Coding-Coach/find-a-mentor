import { action } from '@storybook/addon-actions';
import styled from 'styled-components';
import AvatarField from './AvatarField';
import {
  FaceDetectionProvider,
  type MockFaceDetectionState,
} from '../../stories/mocks/useFaceDetection';

export default {
  title: 'Member Area/Avatar Field',
  component: AvatarField,
};

const StoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 40px;
  max-width: 560px;
`;

const StoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  padding: 24px;
`;

const StoryCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
`;

const StoryTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 16px;
`;

const onToggleGravatar = action('onToggleGravatar');

const createStoryImage = (label: string, background: string) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="12" fill="${background}" />
      <path d="M18 70 L40 48 L56 62 L78 34" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="30" cy="30" r="8" fill="#ffffff" opacity="0.85" />
      <text x="50" y="90" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#ffffff">${label}</text>
    </svg>
  `)}`;

const googleAuth0Id = 'google-oauth2|123456789';
const usernamePasswordAuth0Id = 'auth0|123456789';
const googlePhoto = 'https://avatars.githubusercontent.com/u/219207?v=4';
const gravatarPhoto = 'https://avatars.githubusercontent.com/u/810438?v=4';
const nonFaceGooglePhoto = createStoryImage('Logo', '#5c6ac4');
const nonFaceGravatarPhoto = createStoryImage('Pattern', '#179a6f');

const googleUserUsingGoogleAvatar = {
  auth0Id: googleAuth0Id,
  avatar: undefined,
  auth0Picture: googlePhoto,
};

const googleUserUsingGravatar = {
  auth0Id: googleAuth0Id,
  avatar: gravatarPhoto,
  auth0Picture: googlePhoto,
};

const usernamePasswordUser = {
  auth0Id: usernamePasswordAuth0Id,
  avatar: gravatarPhoto,
  auth0Picture: undefined,
};

const googleUserUsingGoogleAvatarNoFace = {
  auth0Id: googleAuth0Id,
  avatar: undefined,
  auth0Picture: nonFaceGooglePhoto,
};

const googleUserUsingGravatarNoFace = {
  auth0Id: googleAuth0Id,
  avatar: nonFaceGravatarPhoto,
  auth0Picture: googlePhoto,
};

const usernamePasswordUserNoFace = {
  auth0Id: usernamePasswordAuth0Id,
  avatar: nonFaceGravatarPhoto,
  auth0Picture: undefined,
};

type StoryStateProps = {
  title: string;
  user: {
    auth0Id: string;
    avatar?: string;
    auth0Picture?: string;
  };
  isUsingGravatar: boolean;
  faceDetectionState: MockFaceDetectionState;
};

const StoryState = ({
  title,
  user,
  isUsingGravatar,
  faceDetectionState,
}: StoryStateProps) => (
  <StoryCard>
    <StoryTitle>{title}</StoryTitle>
    <FaceDetectionProvider state={faceDetectionState}>
      <AvatarField
        user={user}
        isUsingGravatar={isUsingGravatar}
        onToggleGravatar={onToggleGravatar}
      />
    </FaceDetectionProvider>
  </StoryCard>
);

export const AllStates = () => (
  <StoriesGrid>
    <StoryState
      title="Google avatar / Checking"
      user={googleUserUsingGoogleAvatar}
      isUsingGravatar={false}
      faceDetectionState="checking"
    />
    <StoryState
      title="Google avatar / Face detected"
      user={googleUserUsingGoogleAvatar}
      isUsingGravatar={false}
      faceDetectionState="detected"
    />
    <StoryState
      title="Google avatar / No face detected"
      user={googleUserUsingGoogleAvatarNoFace}
      isUsingGravatar={false}
      faceDetectionState="not-detected"
    />
    <StoryState
      title="Google user on Gravatar / Checking"
      user={googleUserUsingGravatar}
      isUsingGravatar={true}
      faceDetectionState="checking"
    />
    <StoryState
      title="Google user on Gravatar / Face detected"
      user={googleUserUsingGravatar}
      isUsingGravatar={true}
      faceDetectionState="detected"
    />
    <StoryState
      title="Google user on Gravatar / No face detected"
      user={googleUserUsingGravatarNoFace}
      isUsingGravatar={true}
      faceDetectionState="not-detected"
    />
    <StoryState
      title="Gravatar only / Checking"
      user={usernamePasswordUser}
      isUsingGravatar={true}
      faceDetectionState="checking"
    />
    <StoryState
      title="Gravatar only / Face detected"
      user={usernamePasswordUser}
      isUsingGravatar={true}
      faceDetectionState="detected"
    />
    <StoryState
      title="Gravatar only / No face detected"
      user={usernamePasswordUserNoFace}
      isUsingGravatar={true}
      faceDetectionState="not-detected"
    />
  </StoriesGrid>
);

export const GoogleAvatarChecking = () => (
  <StoryContainer>
    <FaceDetectionProvider state="checking">
      <AvatarField
        user={googleUserUsingGoogleAvatar}
        isUsingGravatar={false}
        onToggleGravatar={onToggleGravatar}
      />
    </FaceDetectionProvider>
  </StoryContainer>
);

export const GoogleAvatarFaceDetected = () => (
  <StoryContainer>
    <FaceDetectionProvider state="detected">
      <AvatarField
        user={googleUserUsingGoogleAvatar}
        isUsingGravatar={false}
        onToggleGravatar={onToggleGravatar}
      />
    </FaceDetectionProvider>
  </StoryContainer>
);

export const GoogleAvatarNoFaceDetected = () => (
  <StoryContainer>
    <FaceDetectionProvider state="not-detected">
      <AvatarField
        user={googleUserUsingGoogleAvatarNoFace}
        isUsingGravatar={false}
        onToggleGravatar={onToggleGravatar}
      />
    </FaceDetectionProvider>
  </StoryContainer>
);

export const GoogleUserOnGravatarChecking = () => (
  <StoryContainer>
    <FaceDetectionProvider state="checking">
      <AvatarField
        user={googleUserUsingGravatar}
        isUsingGravatar={true}
        onToggleGravatar={onToggleGravatar}
      />
    </FaceDetectionProvider>
  </StoryContainer>
);

export const GoogleUserOnGravatarFaceDetected = () => (
  <StoryContainer>
    <FaceDetectionProvider state="detected">
      <AvatarField
        user={googleUserUsingGravatar}
        isUsingGravatar={true}
        onToggleGravatar={onToggleGravatar}
      />
    </FaceDetectionProvider>
  </StoryContainer>
);

export const GoogleUserOnGravatarNoFaceDetected = () => (
  <StoryContainer>
    <FaceDetectionProvider state="not-detected">
      <AvatarField
        user={googleUserUsingGravatarNoFace}
        isUsingGravatar={true}
        onToggleGravatar={onToggleGravatar}
      />
    </FaceDetectionProvider>
  </StoryContainer>
);

export const GravatarOnlyChecking = () => (
  <StoryContainer>
    <FaceDetectionProvider state="checking">
      <AvatarField
        user={usernamePasswordUser}
        isUsingGravatar={true}
        onToggleGravatar={onToggleGravatar}
      />
    </FaceDetectionProvider>
  </StoryContainer>
);

export const GravatarOnlyFaceDetected = () => (
  <StoryContainer>
    <FaceDetectionProvider state="detected">
      <AvatarField
        user={usernamePasswordUser}
        isUsingGravatar={true}
        onToggleGravatar={onToggleGravatar}
      />
    </FaceDetectionProvider>
  </StoryContainer>
);

export const GravatarOnlyNoFaceDetected = () => (
  <StoryContainer>
    <FaceDetectionProvider state="not-detected">
      <AvatarField
        user={usernamePasswordUserNoFace}
        isUsingGravatar={true}
        onToggleGravatar={onToggleGravatar}
      />
    </FaceDetectionProvider>
  </StoryContainer>
);
