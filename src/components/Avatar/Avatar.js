import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import UserContext from '../../context/userContext/UserContext';
import Camera from '../../assets/me/camera.svg';
import { updateMentorAvatar } from '../../api';



function Avatar() {
  let { currentUser, updateUser } = useContext(UserContext);
  const [image, setImage] = useState({ preview: '', raw: '' })

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
      <label htmlFor="upload-button">
        <UserAvatar>
          {(currentUser && currentUser.avatar) ? (
            <UserImage alt={currentUser.email} src={currentUser.avatar} />
          ) : (
              <AvatarPlaceHolder alt="No profile picture" src={Camera} />
            )}
        </UserAvatar>
      </label>
      <input type="file" id="upload-button" style={{ display: 'none' }} onChange={handleChange} />
      <h1>{currentUser ? currentUser.name : ""}</h1>
      <p>{currentUser ? currentUser.title : ""}</p>
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
  height: 100%;
  border-radius: 50%;
`;

const CardContainer = styled.div`
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.3);
  margin: 5%;
  padding: 20px 14px 42px 14px;
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
  }
`;


export default Avatar;