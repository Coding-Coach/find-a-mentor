import React, { FC } from 'react';
import styled from 'styled-components';
import Switch from '../Switch/Switch';
import { isGoogleOAuthUser } from '../../helpers/authProvider';
import type { User } from '../../types/models';
import { Tooltip } from 'react-tippy';

type AvatarFieldProps = {
  user: Pick<User, 'auth0Id' | 'avatar' | 'auth0Picture'>;
  isUsingGravatar: boolean;
  onToggleGravatar: (value: boolean) => void;
}

const AvatarField: FC<AvatarFieldProps> = ({
  user,
  isUsingGravatar,
  onToggleGravatar,
}) => {
  const isGoogleUser = isGoogleOAuthUser(user.auth0Id);
  const displayAvatar = user.avatar || user.auth0Picture;

  return (
    <AvatarContainer>
      <AvatarPreview>
        {displayAvatar ? (
          <AvatarImage src={displayAvatar} alt="avatar" />
        ) : (
          <AvatarPlaceholder className="fa fa-user-circle" />
        )}
      </AvatarPreview>
      <AvatarControls>
        {isGoogleUser ? (
          <>
            <SwitchWrapper>
              <Switch
                label={`Switch to ${isUsingGravatar ? 'Google' : 'Gravatar'} Avatar`}
                isChecked={isUsingGravatar}
                onToggle={onToggleGravatar}
                size="small"
              />
              <Tooltip
                title="Toggle between your Google profile picture and Gravatar avatar"
                size="regular"
                arrow={true}
                position="bottom"
              >
                <i className="fa fa-info-circle" style={{ verticalAlign: 'top' }}></i>
              </Tooltip>
            </SwitchWrapper>
            <HelpText>
              Update your avatar picture at{' '}
              {isUsingGravatar ? (
                <a
                  href="https://gravatar.com/profile/avatars"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Gravatar
                </a>
              ) : (
                <a
                  href="https://myaccount.google.com/profile"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Profile
                </a>
              )}
            </HelpText>
          </>
        ) : (
          <>
            <HelpText>
              Your avatar is managed by Gravatar using your email address.
            </HelpText>
            <a
              href="https://gravatar.com/profile/avatars"
              target="_blank"
              rel="noopener noreferrer"
            >
              Update at Gravatar →
            </a>
          </>
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
  display: flex;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
  border: 2px solid #e0e0e0;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarPlaceholder = styled.i`
  font-size: 80px;
  color: #ccc;
`;

const AvatarControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HelpText = styled.div`
  font-size: 12px;
  color: #888;
  line-height: 1.4;

  a {
    color: #4a90e2;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default AvatarField;
