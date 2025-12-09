import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useUser } from '../../../../context/userContext/UserContext';
import Camera from '../../../../assets/me/camera.svg';
import CardContainer from '../../../components/Card/index';
import { getAvatarUrl } from '../../../../helpers/avatar';
import { isGoogleOAuthUser } from '../../../../helpers/authProvider';
import { IconButton } from '../../../components/Button/IconButton';
import { Tooltip } from 'react-tippy';
import { toast } from 'react-toastify';
import { report } from '../../../../ga';
import { useApi } from '../../../../context/apiContext/ApiContext';
import messages from '../../../../messages';
import Switch from '../../../../components/Switch/Switch';

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
  const [primaryAvatarFailed, setPrimaryAvatarFailed] = useState(false);

  if (!currentUser) {
    return null;
  }

  // Access auth0Picture dynamically - it's returned from API but not in schema
  const auth0Picture = (currentUser as any).auth0Picture;
  const isUsingCustomAvatar = currentUser.avatar === 'gravatar';

  // Reset failed state when avatar data changes
  useEffect(() => {
    setPrimaryAvatarFailed(false);
  }, [currentUser.avatar, auth0Picture]);

  const displayAvatar = (!primaryAvatarFailed && currentUser.avatar)
    ? currentUser.avatar
    : auth0Picture;


  const handleImageError = () => {
    // Only mark as failed if this is the primary avatar, not the fallback
    if (!primaryAvatarFailed) {
      setPrimaryAvatarFailed(true);
    }
  };

  const handleToggleGravatar = async (newValue: boolean) => {
    setIsSaving(true);
    try {
      report('Avatar', newValue ? 'use gravatar' : 'use google profile picture');
      const updatedMentor = await api.updateMentor({
        ...currentUser,
        avatar: newValue ? 'gravatar' : '',
      });
      if (updatedMentor) {
        api.clearCurrentUser();
        const updatedUser = await api.getCurrentUser();
        if (updatedUser) {
          updateCurrentUser(updatedUser);
          toast.success('Avatar updated successfully', { toastId: 'avatar-updated' });
          setPrimaryAvatarFailed(false);
        }
      } else {
        toast.error(messages.GENERIC_ERROR);
      }
    } catch (error) {
      toast.error(messages.GENERIC_ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  const isGoogleUser = isGoogleOAuthUser(currentUser.auth0Id);

  return (
    <CardContainer>
      <Container>
        <ShareProfile
          url={`${process.env.NEXT_PUBLIC_AUTH_CALLBACK}/u/${currentUser._id}`}
        />
        <AvatarContainer>
          <AvatarWrapper>
            {displayAvatar ? (
              <UserImage
                alt={currentUser.email}
                src={getAvatarUrl(currentUser)}
                onError={handleImageError}
              />
            ) : (
              <AvatarPlaceHolder alt="No profile picture" src={Camera} />
            )}
          </AvatarWrapper>
        </AvatarContainer>

        {isGoogleUser && (
          <>
            <ToggleLabel>
              <Switch
                label="Use Gravatar"
                isChecked={isUsingCustomAvatar}
                onToggle={handleToggleGravatar}
                size="small"
              />
            </ToggleLabel>
            <ToggleDescription>
              Update your avatar picture at{" "}
              {isUsingCustomAvatar
                ? <a href="https://gravatar.com" target="_blank" rel="noopener noreferrer">Gravatar</a>
                : <a href="https://myaccount.google.com/profile" target="_blank" rel="noopener noreferrer">Google Profile</a>
              }
            </ToggleDescription>
          </>
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

  &:hover img {
    opacity: 0.9;
  }
`;

const AvatarPlaceHolder = styled.img`
  width: 100px;
  height: 100px;
  margin: auto;
  object-fit: cover;
  border-radius: 8px;
`;

const UserImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  transition: opacity 0.2s ease;
`;

const ToggleLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
`;

const ToggleDescription = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.5;
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
