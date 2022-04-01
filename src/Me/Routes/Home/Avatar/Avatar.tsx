import React, { FC } from 'react';
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

const ShareProfile = ({ url }: { url: string }) => {
  const [showInput, setShowInput] = React.useState(false);

  const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    report('Avatar', 'share profile');
    e.target.select();
    navigator.clipboard.writeText(url);
    toast.success('Copied to clipboard', {
      toastId: 'share-profile-toast',
    });
  }

  return (
    <ShareProfileStyled>
      <Tooltip title="Share your profile">
        <IconButton
          icon="share-alt"
          size="lg"
          color="#179a6f"
          onClick={() => setShowInput(!showInput)}
          buttonProps={{
            "aria-label": "Share your profile"
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
  const api = useApi()
  if (!currentUser) {
    return null
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const formData = new FormData();
      formData.append('image', e.target.files[0]);

      const updatedUser = await api.updateMentorAvatar(currentUser, formData);
      updateCurrentUser(updatedUser);
    }
  };

  return (
    <CardContainer>
      <Container>
        <ShareProfile
          url={`${process.env.NEXT_PUBLIC_AUTH_CALLBACK}/u/${currentUser._id}`}
        />
        <label htmlFor="upload-button">
          <UserAvatar>
            {currentUser && currentUser.avatar ? (
              <UserImage
                alt={currentUser.email}
                src={getAvatarUrl(currentUser.avatar)}
              />
            ) : (
              <AvatarPlaceHolder alt="No profile picture" src={Camera} />
            )}
          </UserAvatar>
        </label>
        <input
          type="file"
          id="upload-button"
          style={{ display: 'none' }}
          onChange={handleChange}
        />
        <h1>{currentUser ? currentUser.name : ''}</h1>
        <p>{currentUser ? currentUser.title : ''}</p>
      </Container>
    </CardContainer>
  );
};

const UserAvatar = styled.div`
  height: 100px;
  width: 100px;
  margin: auto;
  background-color: #20293a;
  margin-bottom: 10px;
  border-radius: 50%;
  display: flex;
  cursor: pointer;
`;

const AvatarPlaceHolder = styled.img`
  width: 50%;
  margin: auto;
`;

const UserImage = styled.img`
  object-fit: cover;
  overflow: hidden;
  border-radius: 50%;
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
