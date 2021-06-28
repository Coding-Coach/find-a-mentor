import { PropsWithChildren, useState } from 'react';
import styled from 'styled-components';
import { RadioButtonContainer } from './RadioButton';
import { RadioButtonContext } from './RadioButtonContext';

const StyledRadioButtonGroup = styled.div`
  ${RadioButtonContainer} + ${RadioButtonContainer} {
    margin-top: 10px;
  }
`;

export type RadioButtonGroupProps<T = string> = {
  value: T;
  onChange(value: T): void;
};

const RadioButtonGroup = <T extends string>({
  value: defaultValue,
  onChange,
  children,
}: PropsWithChildren<RadioButtonGroupProps<T>>) => {
  const [value, setValue] = useState<T>(defaultValue);

  const onRadioButtonChange = (newValue: T) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <RadioButtonContext.Provider
      value={{ onChange: onRadioButtonChange, groupValue: value }}
    >
      <StyledRadioButtonGroup>{children}</StyledRadioButtonGroup>
    </RadioButtonContext.Provider>
  );
};

export default RadioButtonGroup;
