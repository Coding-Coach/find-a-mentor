import React, { FC } from 'react';
import styled from 'styled-components';
import { Loader } from '../../../components/Loader';

type Skin = 'primary' | 'secondary' | 'danger';
type ButtonProps = Pick<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  'onClick' | 'id' | 'disabled' | 'type' | 'name' | 'children' | 'title'
> & {
  skin?: Skin;
  isLoading?: boolean;
};

const StyledButton = styled.button`
  height: 30px;
  cursor: pointer;
  font-size: 14px;
  line-height: 17px;
  user-select: none;
  text-align: center;
  border-radius: 3px;
  box-sizing: border-box;
  font-family: Lato, sans-serif;
  transition: box-shadow 0.1s ease-in-out;

  &:hover {
    box-shadow: inset 0 0 100px 0 #00000010;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const PrimaryButton = styled(StyledButton)`
  background-color: #69d5b1;
  color: #fff;
`;

const SecondaryButton = styled(StyledButton)`
  background-color: #fff;
  border: 2px solid;
  color: #69d5b1;
`;

const DangerButton = styled(StyledButton)`
  background-color: #d56969;
  color: #fff;
`;

const getComponentBySkin = (skin: Skin) => {
  switch (skin) {
    case 'primary':
    default:
      return PrimaryButton;
    case 'secondary':
      return SecondaryButton;
    case 'danger':
      return DangerButton;
  }
};

export const Button: FC<ButtonProps> = ({
  skin = 'primary',
  isLoading = false,
  children,
  ...props
}) => {
  const ThemedButton = getComponentBySkin(skin);
  return (
    <ThemedButton {...props}>{isLoading ? <Loader /> : children}</ThemedButton>
  );
};
