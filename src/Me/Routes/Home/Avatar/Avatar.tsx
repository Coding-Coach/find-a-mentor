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
import { RedirectToGravatar } from '../../../Modals/RedirectToGravatar';

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
  const { currentUser } = useUser<true>();

  if (!currentUser) {
    return null;
  }

  return (
    <CardContainer>
      <Container>
        <ShareProfile
          url={`${process.env.NEXT_PUBLIC_AUTH_CALLBACK}/u/${currentUser._id}`}
        />
        <div>
          {currentUser && currentUser.avatar ? (
            <UserImage
              alt={currentUser.email}
              src={getAvatarUrl(currentUser.avatar)}
            />
          ) : (
            <AvatarPlaceHolder alt="No profile picture" src={Camera} />
          )}
          <ChangeAvatarSection>
            Change your avatar on <RedirectToGravatar />
          </ChangeAvatarSection>
        </div>
        <h1>{currentUser ? currentUser.name : ''}</h1>
        <p>{currentUser ? currentUser.title : ''}</p>
      </Container>
    </CardContainer>
  );
};

// Styled components for the updated UI elements
const ChangeAvatarSection = styled.div`
  margin: auto auto 10px;
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
