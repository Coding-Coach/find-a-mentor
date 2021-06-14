import React, { FC } from 'react';
import styled from 'styled-components';
import { Loader } from '../../../components/Loader';

type Skin = 'primary' | 'secondary' | 'danger';
type ButtonProps = Pick<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  'onClick' | 'id' | 'disabled' | 'type' | 'name' | 'children'
> & {
  skin?: Skin;
  isLoading?: boolean;
};

const StyledButton = styled.button`
  box-sizing: border-box;
  height: 30px;
  border-radius: 3px;
  font-family: Lato, sans-serif;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  cursor: pointer;
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
