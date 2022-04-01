import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Camera } from '../assets/me/camera.svg';
import { ReactComponent as Home } from '../assets/me/home.svg';
import { ReactComponent as Available } from '../assets/me/icon-available.svg';
import { ReactComponent as Country } from '../assets/me/icon-country.svg';
import { ReactComponent as Description } from '../assets/me/icon-description.svg';
import { ReactComponent as DoorExit } from '../assets/me/icon-door-exit.svg';
import { ReactComponent as Email } from '../assets/me/icon-email.svg';
import { ReactComponent as SpokenLanguages } from '../assets/me/icon-spokenLanguages.svg';
import { ReactComponent as Tags } from '../assets/me/icon-tags.svg';
import { ReactComponent as Title } from '../assets/me/icon-title.svg';
import { ReactComponent as Unavailable } from '../assets/me/icon-unavailable.svg';
import { ReactComponent as Logo } from '../assets/me/logo.svg';
import { ReactComponent as Mentors } from '../assets/me/mentors.svg';

export default { title: 'Icons' };

/*
NOTE: I really wanted this file to be an mdx file like the rest of them, but the loaders 
and plugins involved don't work properly with SVGA and MDX.  I might take another swing
at it later, but for now I settled for a working version even if it's not mdx.
*/

const Icon = ({ children, light = false }) => (
  <IconContainer light={light}>{children}</IconContainer>
);

export const me = () => (
  <Icons>
    <Icon>
      <Camera />
    </Icon>
    <Icon>
      <Home />
    </Icon>
    <Icon>
      <Available />
    </Icon>
    <Icon>
      <Country />
    </Icon>
    <Icon>
      <Description />
    </Icon>
    <Icon>
      <DoorExit />
    </Icon>
    <Icon>
      <Email />
    </Icon>
    <Icon>
      <SpokenLanguages />
    </Icon>
    <Icon>
      <Tags />
    </Icon>
    <Icon>
      <Title />
    </Icon>
    <Icon>
      <Unavailable />
    </Icon>
    <Icon light>
      <Logo />
    </Icon>
    <Icon>
      <Mentors />
    </Icon>
  </Icons>
);

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

  ${(props) => props.light && { background: '#eee' }}

  > svg {
    width: 100%;
  }
`;
