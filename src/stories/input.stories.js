import React from 'react';
import 'styled-components/macro';
import Input from '../Me/components/Input';
import Textarea from '../Me/components/Textarea';
import FormField from '../Me/components/FormField';

import { StoriesContainer } from './StoriesContainer';

export default { title: 'Input' };

const fieldStyle = {
  width: '60%'
}

export const ProfileEdit = () => {
  return (
    <StoriesContainer>
      <h1>Update Profile</h1>
      <FormField label="Full Name" css={fieldStyle}>
        <Input type="text" placeholder="John Smith" />
      </FormField>
      <FormField label="Full Name" css={fieldStyle} helpText="help message">
        <Input type="text" placeholder="With help message" />
      </FormField>
      <FormField label="Title" css={fieldStyle}>
        <Input type="text" placeholder="Sr Software Engineer" />
      </FormField>
      <FormField css={fieldStyle}>
        <Input type="text" placeholder="Look ma, no label" />
      </FormField>
      <FormField label="About" css={fieldStyle}>
        <Textarea placeholder="Tell people about yourself" />
      </FormField>
    </StoriesContainer>
  );
};
