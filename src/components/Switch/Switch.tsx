import { ChangeEvent, useContext } from 'react';
import styled from 'styled-components';
import { formFieldContext } from '../../Me/components/FormField/formContext';

type SwitchProps = {
  id?: string;
  label: string;
  isChecked: boolean;
  size?: 'small' | 'normal';
  onToggle(isChecked: boolean): void;
};

const SwitchContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

let SwitchInputRoot = styled.div<Pick<SwitchProps, 'size'>>`
  height: 20px;

  input[type='checkbox'] {
    height: 0;
    width: 0;
    visibility: hidden;

    &:checked + label {
      background-color: var(--tag-color);

      &:after {
        transform: translateX(-100%);

        ${props =>
          props.size === 'small'
            ? `
          left: calc(100% - 2.5px);
        `
            : `
          left: calc(100% - 5px);
        `}
      }
    }
  }

  label {
    display: block;
    cursor: pointer;
    position: relative;
    text-indent: -9999px;
    border-radius: 100px;
    background-color: grey;
    transition: background-color 0.35s ease-in-out;

    ${props =>
      props.size === 'small'
        ? `
        width: 25px;
        height: 15px;
        top: -15px;
        margin-left: 5px;
      `
        : `
        top: -25px;
        width: 60px;
        height: 30px;
      `}

    &:after {
      content: '';
      position: absolute;
      background: #fff;
      transition: left 0.2s ease-in-out, transform 0.2s ease-in-out;

      ${props =>
        props.size === 'small'
          ? `
        top: 2.5px;
        left: 2.5px;
        width: 10px;
        height: 10px;
        border-radius: 10px;
      `
          : `
        top: 5px;
        left: 5px;
        width: 20px;
        height: 20px;
        border-radius: 20px;
      `}
    }
  }
`;

const SwitchLabel = ({ id, label }: Pick<SwitchProps, 'id' | 'label'>) => (
  <label id={id} htmlFor={`switch-input-${id}`}>
    {label}
  </label>
);

const SwitchInput = ({
  onToggle,
  isChecked,
  id,
  size = 'normal',
}: Pick<SwitchProps, 'onToggle' | 'isChecked' | 'id' | 'size'>) => {
  const toggleSwitch = (event: ChangeEvent<HTMLInputElement>) => {
    onToggle(event.target?.checked);
  };

  return (
    <SwitchInputRoot size={size}>
      <input
        type="checkbox"
        id={`switch-input-${id}`}
        checked={isChecked}
        onChange={toggleSwitch}
      />
      <label id={`switch-label-${id}`} htmlFor={`switch-input-${id}`}>
        Toggle
      </label>
    </SwitchInputRoot>
  );
};

const Switch = ({
  id: idFromProps = '',
  label,
  onToggle,
  size,
  isChecked,
}: SwitchProps) => {
  const idFromContext = useContext(formFieldContext);
  const id = idFromProps || idFromContext;

  return (
    <SwitchContainer className={id}>
      <SwitchLabel id={id} label={label} />
      <SwitchInput
        isChecked={isChecked}
        size={size}
        id={id}
        onToggle={onToggle}
      />
    </SwitchContainer>
  );
};

export default Switch;
