import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import UserContext from '../../../../context/userContext/UserContext';
import Camera from '../../../../assets/me/camera.svg';
import { updateMentorAvatar, getCurrentUser } from '../../../../api';
import CardContainer from '../../../components/Card/index'
import { getAvatarUrl } from '../../../../helpers/avatar';

function Avatar() {
  let { currentUser, updateUser } = useContext(UserContext);
  const [image, setImage] = useState({ preview: '', raw: '' })

  useEffect(() => {
    async function initialize() {
      const user = await getCurrentUser();
      updateUser(user);
    }
    initialize();
  });

  const handleChange = (e) => {
    if (e) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      })

      handleUpload(e);
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('image', image.raw)

    const updatedUser = await updateMentorAvatar(currentUser, formData);
    updateUser(updatedUser);
  }

  return (
    <CardContainer>
      <Container>
        <label htmlFor="upload-button">
          <UserAvatar>
            {(currentUser && currentUser.avatar) ? (
              <UserImage alt={currentUser.email} src={getAvatarUrl(currentUser.avatar)} />
            ) : (
                <AvatarPlaceHolder alt="No profile picture" src={Camera} />
              )}
          </UserAvatar>
        </label>
        <input type="file" id="upload-button" style={{ display: 'none' }} onChange={handleChange} />
        <h1>{currentUser ? currentUser.name : ""}</h1>
        <p>{currentUser ? currentUser.title : ""}</p>
      </Container>
    </CardContainer>
  );
}


const UserAvatar = styled.div`
  height: 100px;
  width: 100px;
  margin: auto;
  background-color:#20293A;
  margin-bottom:10px;
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
    line-height:17px;
    margin: 0;
    margin-top: 1%;
  }
`;


export default Avatar;