import { FC, useState } from 'react';
import styled from 'styled-components';
import { RadioButtonContainer } from './RadioButton';
import { RadioButtonContext } from './RadioButtonContext';

const StyledRadioButtonGroup = styled.div`
  ${RadioButtonContainer} + ${RadioButtonContainer} {
    margin-top: 10px;
  }
`;

export type RadioButtonGroupProps = {
  value: string;
  onChange(value: string): void;
};

const RadioButtonGroup: FC<RadioButtonGroupProps> = ({
  value: defaultValue,
  onChange,
  children,
}) => {
  const [value, setValue] = useState(defaultValue);

  const onRadioButtonChange = (newValue: string) => {
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
