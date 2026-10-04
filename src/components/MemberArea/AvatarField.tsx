import React, { FC, useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { isGoogleOAuthUser } from '../../helpers/authProvider';
import { isKnownNonFaceAvatar } from '../../helpers/avatar';
import type { User } from '../../types/models';
import { useFaceDetection } from '../../hooks/useFaceDetection';
import AvatarProviderLink from '../AvatarProviderLink';
import { avatarChangeProviderLinks } from '../../config/constants';

type AvatarFieldProps = {
  user: Pick<User, 'auth0Id' | 'avatar' | 'auth0Picture'>;
  isUsingGravatar: boolean;
  onToggleGravatar: (value: boolean) => void;
  disabled?: boolean;
};

const AvatarField: FC<AvatarFieldProps> = ({
  user,
  isUsingGravatar,
  onToggleGravatar,
  disabled = false,
}) => {
  const isGoogleUser = isGoogleOAuthUser(user.auth0Id);
  const displayAvatar = user.avatar || user.auth0Picture;
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const { faceDetected, isChecking } = useFaceDetection(imageRef);
  const hasKnownNonFaceAvatar = isKnownNonFaceAvatar(displayAvatar);
  const showNonFaceWarning = faceDetected === false || hasKnownNonFaceAvatar;
  const showGoogleAvatarLoadWarning =
    avatarLoadError && isGoogleUser && !isUsingGravatar;
  const showAvatarWarning = showNonFaceWarning || showGoogleAvatarLoadWarning;
  const shouldPulseAvatar =
    isChecking && !hasKnownNonFaceAvatar && !avatarLoadError;
  const updateAvatarUrl = isUsingGravatar
    ? avatarChangeProviderLinks.GRAVATAR
    : avatarChangeProviderLinks.GOOGLE;
  const updateAvatarTitle = `Update avatar on ${isUsingGravatar ? 'Gravatar' : 'Google'}`;

  useEffect(() => {
    setAvatarLoadError(false);
  }, [displayAvatar]);

  return (
    <AvatarContainer>
      <AvatarPreview>
        <AvatarSourceOverlay>
          <AvatarProviderLink
            href={updateAvatarUrl}
            title={updateAvatarTitle}
          />
        </AvatarSourceOverlay>
        {displayAvatar && !avatarLoadError ? (
          <AvatarImage
            $isChecking={shouldPulseAvatar}
            ref={imageRef}
            src={displayAvatar}
            alt="avatar"
            crossOrigin={hasKnownNonFaceAvatar ? undefined : 'anonymous'}
            onError={() => setAvatarLoadError(true)}
            onLoad={() => setAvatarLoadError(false)}
          />
        ) : (
          <AvatarPlaceholder className="fa fa-user-circle" />
        )}
      </AvatarPreview>
      <AvatarControls>
        {showAvatarWarning && (
          <FaceDetectionWarning>
            <i className="fa fa-times-circle" />{' '}
            {showGoogleAvatarLoadWarning
              ? "We couldn't load your Google avatar."
              : 'Please use a real photo'}
            {(showNonFaceWarning || showGoogleAvatarLoadWarning) &&
              isGoogleUser &&
              !isUsingGravatar && (
              <>
                <br />
                If you prefer not to change your Google avatar,{' '}
                <ActionLinkButton
                  type="button"
                  disabled={disabled}
                  onClick={() => onToggleGravatar(true)}
                >
                  switch to Gravatar
                </ActionLinkButton>
                .
              </>
            )}
          </FaceDetectionWarning>
        )}
      </AvatarControls>
    </AvatarContainer>
  );
};

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const AvatarPreview = styled.div`
  position: relative;
  display: flex;
  flex: 0 0 100px;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
  border: 2px solid #e0e0e0;
`;

const AvatarSourceOverlay = styled.div`
  position: absolute;
  top: 6px;
  left: 6px;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s;

  ${AvatarPreview}:hover & {
    opacity: 1;
  }
`;

const avatarCheckingPulse = keyframes`
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }
`;

const AvatarImage = styled.img<{ $isChecking: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  ${({ $isChecking }) =>
    $isChecking &&
    css`
      animation: ${avatarCheckingPulse} 1.4s ease-in-out infinite;
    `}
`;

const AvatarPlaceholder = styled.i`
  font-size: 80px;
  color: #ccc;
`;

const AvatarControls = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 5px;
`;

const FaceDetectionWarning = styled.div`
  font-size: 12px;
  color: #c0392b;
  line-height: 1.4;

  a,
  button {
    color: #c0392b;
    font-weight: bold;
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
`;

const ActionLinkButton = styled.button`
  border: 0;
  background: none;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;
`;

export default AvatarField;
