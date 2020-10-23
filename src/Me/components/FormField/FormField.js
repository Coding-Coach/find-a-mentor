import React, { useState } from 'react';
import styled from 'styled-components';
import uniqueId from 'lodash/uniqueId';
import { formFieldContext } from './formContext';

const FormFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: Lato, sans-serif;
  margin-bottom: 30px;
`;
const Label = styled.label`
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  margin-bottom: 6px;
`;

export const FormField = ({ label, className, children }) => {
  const [id] = useState(() => uniqueId('form-field-'));
  return (
    <FormFieldContainer className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <formFieldContext.Provider value={id}>
        {children}
      </formFieldContext.Provider>
    </FormFieldContainer>
  );
};
