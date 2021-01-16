import React, { useContext } from 'react';
import styled from 'styled-components';
import { formFieldContext } from '../FormField/formContext';

const StyledTextarea = styled.textarea`
  font-family: Lato, sans-serif;
  font-size: 14px;
  line-height: 17px;
  border-radius: 3px;
  background-color: #fff;
  border: 1px solid #bfbfbf;
  padding: 7px 12px 6px 8px;
  color: #4f4f4f;
  ::placeholder {
    color: #898889;
  }
  min-height: 75px;
`;

export const Textarea = props => {
  const id = useContext(formFieldContext);
  return <StyledTextarea id={id} {...props} />;
};
