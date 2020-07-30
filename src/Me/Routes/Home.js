import React from 'react';

import Avatar from './Home/Avatar/Avatar';
import Profile from '../../Me/Profile/Profile';
import BecomeMentor from './Home/BecomeMentor/BecomeMentor';

export const Home = () => {
  return (
    <>
      <Avatar />
      <Profile />
      <BecomeMentor />
    </>
  );
};

export default Home;
