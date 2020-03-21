import React, { useContext } from 'react';
import styled from 'styled-components';
import UserContext from '../../context/userContext/UserContext';
import Camera from '../../assets/me/camera.svg';



function Avatar({ }) {
  const { currentUser, updateUser } = useContext(UserContext);

  return (
    <CardContainer>
      <UserAvatar>
        {currentUser ? (
          <UserImage alt={currentUser.email} src={currentUser.avatar} />
        ) : (
            <AvatarPlaceHolder alt="No profile picture" src={Camera} />
          )}
      </UserAvatar>
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
`;

const AvatarPlaceHolder = styled.img`
  width: 50%;
  fill: white;
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