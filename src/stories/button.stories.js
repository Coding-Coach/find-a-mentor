import React, { useState } from 'react';
import 'styled-components/macro';
import Button from '../Me/components/Button';

import { StoriesContainer } from './StoriesContainer';

export default { title: 'Button' };

export const Buttons = () => {
  const [msg, setMsg] = useState('');
  return (
    <StoriesContainer>
      <h1>Update Profile</h1>
      <Button onClick={() => setMsg('Primary clicked!')}>Primary</Button>
      <Button skin="secondary" onClick={() => setMsg('Secondary clicked!')}>
        Secondary
      </Button>
      <h2>{msg}</h2>
    </StoriesContainer>
  );
};
