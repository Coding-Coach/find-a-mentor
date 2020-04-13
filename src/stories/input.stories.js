import React from 'react';
import 'styled-components/macro';
import Input from '../Me/components/Input';
import Textarea from '../Me/components/Textarea';
import FormField from '../Me/components/FormField';

import { StoriesContainer } from './StoriesContainer';

export default { title: 'Input' };

export const ProfileEdit = () => {
  return (
    <StoriesContainer>
      <h1>Update Profile</h1>
      <FormField label="Full Name" css={{ width: '60%' }}>
        <Input type="text" placeholder="John Smith" />
      </FormField>
      <FormField label="Title" css={{ width: '60%' }}>
        <Input type="text" placeholder="Sr Software Engineer" />
      </FormField>
      <FormField css={{ width: '60%' }}>
        <Input type="text" placeholder="Look ma, no label" />
      </FormField>
      <FormField label="About" css={{ width: '60%' }}>
        <Textarea placeholder="Tell people about yourself" />
      </FormField>
    </StoriesContainer>
  );
};
