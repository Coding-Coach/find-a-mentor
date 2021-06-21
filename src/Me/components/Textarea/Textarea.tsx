import React, { TextareaHTMLAttributes, useContext } from 'react';
import styled from 'styled-components';
import { formFieldContext } from '../FormField/formContext';

const StyledTextarea = styled.textarea<{ invalid?: boolean }>`
  font-family: Lato, sans-serif;
  font-size: 14px;
  line-height: 17px;
  border-radius: 3px;
  background-color: #fff;
  border: 1px solid #bfbfbf;
  padding: 7px 12px 6px 8px;
  color: #4f4f4f;
  ::placeholder {
    color: ${props =>
      props.invalid
        ? 'var(--form-text-invalid)'
        : 'var(--form-text-placeholder)'};
  }
  min-height: 75px;
`;

export const Textarea = (props: TextareaHTMLAttributes<unknown>) => {
  const id = useContext(formFieldContext);
  return <StyledTextarea id={id} {...props} />;
};
