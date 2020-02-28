import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Logo } from '../assets/me/logo.svg';
import { ReactComponent as Home } from '../assets/me/home.svg';
import { ReactComponent as Mentors } from '../assets/me/mentors.svg';

export default { title: 'Icons' };

const Icon = ({
  children,
  light = false
}) => (
  <IconContainer light={light}>
    {children}
  </IconContainer>
)

export const me = () => (
  <Icons>
    <Icon light><Logo /></Icon>
    <Icon><Home /></Icon>
    <Icon><Mentors /></Icon>
  </Icons>
)

const Icons = styled.div`
  display: flex;
`;

const IconContainer = styled.div`
  width: 44px;
  margin: 5px;
  padding: 5px;
  display: flex;
  border-radius: 5px;
  align-items: center;
  border: 1px solid #aaa;

  ${props => props.light && {background: '#eee'}}

  > svg {
    width: 100%
  }
`;