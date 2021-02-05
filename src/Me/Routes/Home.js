import React from 'react';
import MentorshipReq from '../MentorshipReq/MentorshipReq';

import Avatar from './Home/Avatar/Avatar';
import Profile from '../../Me/Profile/Profile';

export const Home = () => {
  return (
    <>
      <Avatar />
      <Profile />
      <MentorshipReq />
    </>
  );
};

export default Home;
