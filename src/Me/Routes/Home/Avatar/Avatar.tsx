import React, { FC, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components/macro';
import { useUser } from '../../../../context/userContext/UserContext';

import Camera from '../../../../assets/me/camera.svg';
import CardContainer from '../../../components/Card/index';
import { isGoogleOAuthUser } from '../../../../helpers/authProvider';
import { isKnownNonFaceAvatar } from '../../../../helpers/avatar';
import { IconButton } from '../../../components/Button/IconButton';
import { Tooltip } from 'react-tippy';
import { toast } from 'react-toastify';
import { report } from '../../../../ga';
import { useApi } from '../../../../context/apiContext/ApiContext';
import messages from '../../../../messages';
import { useFaceDetection } from '../../../../hooks/useFaceDetection';
import AvatarProviderLink from '../../../../components/AvatarProviderLink';
import { avatarChangeProviderLinks } from '../../../../config/constants';

const ShareProfile = ({ url }: { url: string }) => {
  const [showInput, setShowInput] = React.useState(false);

  const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    report('Avatar', 'share profile');
    e.target.select();
    navigator.clipboard.writeText(url);
    toast.success('Copied to clipboard', {
      toastId: 'share-profile-toast',
    });
  };

  return (
    <ShareProfileStyled>
      <Tooltip title="Share your profile">
        <IconButton
          icon="share-alt"
          size="lg"
          color="#179a6f"
          onClick={() => setShowInput(!showInput)}
          buttonProps={{
            'aria-label': 'Share your profile',
          }}
        />
      </Tooltip>
      {showInput && (
        <div>
          <input
            readOnly
            type="text"
            value={url}
            onFocus={onInputFocus}
            onBlur={() => setShowInput(false)}
          />
        </div>
      )}
    </ShareProfileStyled>
  );
};

const Avatar: FC = () => {
  const { currentUser, updateCurrentUser } = useUser<true>();
  const api = useApi();
  const [isSaving, setIsSaving] = useState(false);
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const { faceDetected, isChecking } = useFaceDetection(imageRef);

  React.useEffect(() => {
    setAvatarLoadError(false);
  }, [currentUser?.avatar]);

  if (!currentUser) {
    return null;
  }

  const isUsingGravatar = currentUser.avatar?.includes('gravatar.com') || false;
  const isGoogleUser = isGoogleOAuthUser(currentUser.auth0Id);
  const hasKnownNonFaceAvatar = isKnownNonFaceAvatar(currentUser.avatar);
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

  const handleToggleGravatar = async (newValue: boolean) => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    try {
      report('Avatar', newValue ? 'use gravatar' : 'use google profile picture');
      const updatedUser = await api.toggleAvatar(newValue);
      if (updatedUser) {
        api.clearCurrentUser();
        updateCurrentUser(updatedUser);
        toast.success('Avatar updated successfully', { toastId: 'avatar-updated' });
      } else {
        toast.error(messages.GENERIC_ERROR);
      }
    } catch (error) {
      toast.error(messages.GENERIC_ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CardContainer>
      <Container>
        <ShareProfile
          url={`${process.env.NEXT_PUBLIC_AUTH_CALLBACK}/u/${currentUser._id}`}
        />
        <AvatarContainer>
          <AvatarWrapper>
            <AvatarSourceOverlay>
              <AvatarProviderLink
                href={updateAvatarUrl}
                title={updateAvatarTitle}
              />
            </AvatarSourceOverlay>
            {currentUser.avatar && !avatarLoadError ? (
              <UserImage
                $isChecking={shouldPulseAvatar}
                ref={imageRef}
                alt={currentUser.email}
                src={currentUser.avatar}
                crossOrigin={hasKnownNonFaceAvatar ? undefined : 'anonymous'}
                onError={() => setAvatarLoadError(true)}
                onLoad={() => setAvatarLoadError(false)}
              />
            ) : (
              <AvatarPlaceHolder alt="No profile picture" src={Camera} />
            )}
          </AvatarWrapper>
        </AvatarContainer>
        {showAvatarWarning && (
          <FaceDetectionWarning>
            <i className="fa fa-times-circle" />{' '}
            {showGoogleAvatarLoadWarning
              ? "We couldn't load your Google avatar."
              : 'Please use a real photo of your face.'}
            {(showNonFaceWarning || showGoogleAvatarLoadWarning) &&
              isGoogleUser &&
              !isUsingGravatar && (
              <>
                <br />
                {
                  showNonFaceWarning ? "If you prefer not to change your Google avatar, " : "If you're having trouble with your Google avatar, you can "
                }
                <ActionLinkButton
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleToggleGravatar(true)}
                >
                  switch to Gravatar
                </ActionLinkButton>
                .
              </>
            )}
          </FaceDetectionWarning>
        )}
        <h1>{currentUser ? currentUser.name : ''}</h1>
        <p>{currentUser ? currentUser.title : ''}</p>
      </Container>
    </CardContainer>
  );
};

// Styled components
const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const AvatarWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100px;
  height: 100px;
  flex: 0 0 100px;

  &:hover img {
    opacity: 0.9;
  }
`;

const AvatarSourceOverlay = styled.div`
  position: absolute;
  top: 6px;
  left: 6px;
  z-index: 1;
`;

const AvatarPlaceHolder = styled.img`
  width: 100px;
  height: 100px;
  margin: auto;
  object-fit: cover;
  border-radius: 8px;
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

const UserImage = styled.img<{ $isChecking: boolean }>`
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  transition: opacity 0.2s ease;
  ${({ $isChecking }) =>
    $isChecking &&
    css`
      animation: ${avatarCheckingPulse} 1.4s ease-in-out infinite;
    `}
`;

const FaceDetectionWarning = styled.div`
  font-size: 12px;
  color: #c0392b;
  margin-bottom: 4px;
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
`;

const Container = styled.div`
  position: relative;
  text-align: center;

  h1 {
    color: #4a4a4a;
    font-weight: bold;
    line-height: 26px;
    margin: 0;
  }

  p {
    color: #4a4a4a;
    line-height: 17px;
    margin: 0;
    margin-top: 1%;
  }
`;

const ShareProfileStyled = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  text-align: right;

  input {
    margin: 10px 0;
    padding: 5px;
    width: 300px;
  }
`;

export default Avatar;
