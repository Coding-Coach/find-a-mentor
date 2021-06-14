import { InputHTMLAttributes, useContext } from 'react';
import styled from 'styled-components';
import { formFieldContext } from '../FormField/formContext';

const StyledInput = styled.input`
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
  :disabled {
    background-color: #dadada;
  }
`;

export const Input = (props: InputHTMLAttributes<unknown>) => {
  const id = useContext(formFieldContext);
  return <StyledInput placeholder="bbb" id={id} {...props} />;
};
