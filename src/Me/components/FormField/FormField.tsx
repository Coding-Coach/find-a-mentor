import { FC, useState } from 'react';
import styled from 'styled-components';
import uniqueId from 'lodash/uniqueId';
import { formFieldContext } from './formContext';

const InlineHelpText = styled.span`
  color: #5c5c5c;
  font-weight: normal;

  &:before {
    content: '(';
  }

  &:after {
    content: ')';
  }
`;

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

type FormFieldProps = {
  label: string;
  className?: string;
  helpText?: string;
};

export const FormField: FC<FormFieldProps> = ({
  label,
  className,
  children,
  helpText,
}) => {
  const [id] = useState(() => uniqueId('form-field-'));
  return (
    <FormFieldContainer className={className}>
      {label && (
        <Label htmlFor={id}>
          {label} {helpText && <InlineHelpText>{helpText}</InlineHelpText>}
        </Label>
      )}
      <formFieldContext.Provider value={id}>
        {children}
      </formFieldContext.Provider>
    </FormFieldContainer>
  );
};
