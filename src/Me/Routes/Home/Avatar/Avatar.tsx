import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useUser } from '../../../../context/userContext/UserContext';
import Camera from '../../../../assets/me/camera.svg';
import CardContainer from '../../../components/Card/index';
import { getAvatarUrl } from '../../../../helpers/avatar';
import { IconButton } from '../../../components/Button/IconButton';
import { Tooltip } from 'react-tippy';
import { toast } from 'react-toastify';
import { report } from '../../../../ga';
import { useApi } from '../../../../context/apiContext/ApiContext';
import messages from '../../../../messages';
import AvatarEditModal from './AvatarEditModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [primaryAvatarFailed, setPrimaryAvatarFailed] = useState(false);

  if (!currentUser) {
    return null;
  }

  // Access auth0Picture dynamically - it's returned from API but not in schema
  const auth0Picture = (currentUser as any).auth0Picture;

  // Reset failed state when avatar data changes
  useEffect(() => {
    setPrimaryAvatarFailed(false);
  }, [currentUser.avatar, auth0Picture]);

  // Determine which avatar to display
  // If primary avatar exists and hasn't failed, use it. Otherwise use auth0Picture
  const displayAvatar = (!primaryAvatarFailed && currentUser.avatar)
    ? currentUser.avatar
    : auth0Picture;

  const isUsingCustomAvatar = currentUser.avatar && currentUser.avatar !== auth0Picture;

  const handleImageError = () => {
    // Only mark as failed if this is the primary avatar, not the fallback
    if (!primaryAvatarFailed) {
      setPrimaryAvatarFailed(true);
    }
  };

  const handleSaveAvatar = async (avatarUrl: string) => {
    setIsSaving(true);

    try {
      const updateMentorResult = await api.updateMentor({
        ...currentUser,
        avatar: avatarUrl || null, // null to clear and use Auth0 default
      });

      if (updateMentorResult) {
        api.clearCurrentUser();
        const updatedUser = await api.getCurrentUser();
        if (updatedUser) {
          updateCurrentUser(updatedUser);
          setPrimaryAvatarFailed(false); // Reset error state
          toast.success('Avatar updated successfully');
          setIsModalOpen(false);
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

  return (
    <CardContainer>
      <Container>
        <ShareProfile
          url={`${process.env.NEXT_PUBLIC_AUTH_CALLBACK}/u/${currentUser._id}`}
        />
        <AvatarContainer>
          <AvatarWrapper onClick={() => setIsModalOpen(true)}>
            {displayAvatar ? (
              <UserImage
                alt={currentUser.email}
                src={getAvatarUrl(displayAvatar)}
                onError={handleImageError}
              />
            ) : (
              <AvatarPlaceHolder alt="No profile picture" src={Camera} />
            )}
            <AvatarSourceBadge>
              {isUsingCustomAvatar ? '📷' : '🔐'}
            </AvatarSourceBadge>
          </AvatarWrapper>
          <AvatarHint>Click to change avatar</AvatarHint>
        </AvatarContainer>
        <h1>{currentUser ? currentUser.name : ''}</h1>
        <p>{currentUser ? currentUser.title : ''}</p>

        <AvatarEditModal
          isOpen={isModalOpen}
          currentAvatar={currentUser.avatar || ''}
          auth0Id={currentUser.auth0Id}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveAvatar}
          isSaving={isSaving}
        />
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
  cursor: pointer;
  display: inline-block;

  &:hover img {
    opacity: 0.9;
  }
`;

const AvatarSourceBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background-color: white;
  border: 2px solid #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const AvatarHint = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0;
  font-style: italic;
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
