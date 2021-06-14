import React, { useCallback, useContext, useEffect } from 'react';
import styled from 'styled-components';
import UserContext from '../../../../context/userContext/UserContext';
import Camera from '../../../../assets/me/camera.svg';
import { updateMentorAvatar, getCurrentUser } from '../../../../api';
import CardContainer from '../../../components/Card/index';
import { getAvatarUrl } from '../../../../helpers/avatar';

const Avatar = () => {
  let { currentUser, updateUser } = useContext(UserContext);

  const initialize = useCallback(async () => {
    const user = await getCurrentUser();
    updateUser(user);
  }, [updateUser]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const formData = new FormData();
      formData.append('image', e.target.files[0]);

      const updatedUser = await updateMentorAvatar(currentUser, formData);
      updateUser(updatedUser);
    }
  };

  return (
    <CardContainer>
      <Container>
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
}

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

export default Avatar;
