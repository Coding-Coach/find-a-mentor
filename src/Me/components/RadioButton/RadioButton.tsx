import { InputHTMLAttributes, ReactChild, useContext } from 'react';
import styled from 'styled-components';
import { RadioButtonContext } from './RadioButtonContext';

type RadioButtonProps = {
  LabelComponent: ReactChild;
  checked?: boolean;
  onChange?: (value: string) => void;
};

export const RadioButtonContainer = styled.div`
  width: fit-content;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  position: relative;
  vertical-align: middle;

  & + & {
    margin-top: 10px;
  }
`;

const HiddenRadioButton = styled.input.attrs({ type: 'radio' })`
  border: 0;
  width: 24px;
  height: 24px;
  cursor: pointer;
  opacity: 0;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
`;

const StyledRadioButton = styled.span<Pick<RadioButtonProps, 'checked'>>`
  border: 2px solid #69d5b1;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  background-color: #fff;
  cursor: pointer;
  position: relative;
  display: block;

  input:checked + &:before {
    content: '';
    position: absolute;
    inset: 3px;
    background: #179a6f;
    border-radius: 50%;
    display: block;
  }
`;

const Label = styled.label`
  margin-left: 0.9rem;
  color: #4f4f4f;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const RadioButton = ({
  LabelComponent,
  checked,
  value,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & RadioButtonProps) => {
  const groupContext = useContext(RadioButtonContext);
  const { groupValue, onChange } = groupContext || {
    onChange: props.onChange,
  };
  const defaultChecked = Boolean(groupContext ? groupValue === value : checked);

  return (
    <RadioButtonContainer>
      <Label>
        <HiddenRadioButton
          defaultChecked={defaultChecked}
          {...props}
          value={value}
          onChange={e => {
            onChange?.(e.target.value);
          }}
          type="radio"
        />
        <StyledRadioButton />
        {LabelComponent}
      </Label>
    </RadioButtonContainer>
  );
};
