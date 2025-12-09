import React, { FC, useState } from 'react';
import styled from 'styled-components/macro';
import { useUser } from '../../../../context/userContext/UserContext';
import Camera from '../../../../assets/me/camera.svg';
import CardContainer from '../../../components/Card/index';
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

  if (!currentUser) {
    return null;
  }

  const isUsingGravatar = currentUser.avatar?.includes('gravatar.com') || false;

  const handleToggleGravatar = async (newValue: boolean) => {
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

  const isGoogleUser = isGoogleOAuthUser(currentUser.auth0Id);

  return (
    <CardContainer>
      <Container>
        <ShareProfile
          url={`${process.env.NEXT_PUBLIC_AUTH_CALLBACK}/u/${currentUser._id}`}
        />
        <AvatarContainer>
          <AvatarWrapper>
            {currentUser.avatar ? (
              <UserImage
                alt={currentUser.email}
                src={currentUser.avatar}
              />
            ) : (
              <AvatarPlaceHolder alt="No profile picture" src={Camera} />
            )}
          </AvatarWrapper>
        </AvatarContainer>

        {isGoogleUser && (
          <>
            <Tooltip
              title="Use Gravatar for a different avatar from your Google photo"
              size="regular"
              arrow={true}
              position="bottom"
            >
              <i className="fa fa-info-circle"></i>
            </Tooltip>{" "}
            <ToggleLabel>
              <Switch
                label="Use Gravatar"
                isChecked={isUsingGravatar}
                onToggle={handleToggleGravatar}
                size="small"
              />
            </ToggleLabel>
            <ToggleDescription>
              Update your avatar picture at{" "}
              {isUsingGravatar
                ? <a href="https://gravatar.com/profile/avatars" target="_blank" rel="noopener noreferrer">Gravatar</a>
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
  display: block;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  transition: opacity 0.2s ease;
`;

const ToggleLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
`;

const ToggleDescription = styled.div`
  font-size: 13px;
  color: #666;
  margin: 0 0 12px 0;
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
