import { useContext } from 'react';
import { formFieldContext } from '../FormField/formContext';
import styled from 'styled-components';

type CheckboxProps = {
  LabelComponent: string;
  checked: boolean;
}

const CheckboxContainer = styled.div`
  width: fit-content;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  position: relative;
  vertical-align: middle;
`;

const Icon = styled.svg`
  fill: none;
  stroke: #179a6f;
  stroke-width: 2px;
  visibility: hidden;
  transition: all 0.1s ease-in-out;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
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

const StyledCheckbox = styled.div<Pick<CheckboxProps, 'checked'>>`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  box-sizing: border-box;
  padding-right: 2px;
  border: 2px solid #69d5b1;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  background-color: #fff;
  cursor: pointer;

  ${Icon} {
    visibility: ${props => (props.checked ? 'visible' : 'hidden')};
  }
`;

const Label = styled.label`
  margin-left: 0.9rem;
  color: #4f4f4f;
  font-size: 14px;
`;

export const Checkbox = ({ LabelComponent, checked, ...props }: CheckboxProps) => {
  const id = useContext(formFieldContext);
  return (
    <CheckboxContainer>
      <HiddenCheckbox id={id} defaultChecked={checked} {...props} />
      <StyledCheckbox checked={checked}>
        <Icon viewBox="0 24 24" width="22px" height="22px">
          <polyline points="20 6 9 17 4 12" />
        </Icon>
      </StyledCheckbox>
      <Label htmlFor={id}>{LabelComponent}</Label>
    </CheckboxContainer>
  );
};
