import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import auth from '../../utils/auth';
import { mobile, desktop } from '../styles/shared/devices';
import messages from '../../messages';
import { ReactComponent as IconHome } from '../../assets/me/home.svg';
import { ReactComponent as IconMentors } from '../../assets/me/mentors.svg';
import { ReactComponent as IconLogout } from '../../assets/me/icon-door-exit.svg';

const MenuItem = ({ icon: Icon, label, to }) => (
  <NavItemDecoration to={to}>
    <Icon />
    <Label>{label}</Label>
  </NavItemDecoration>
);

const Navbar = () => {
  return (
    <>
      <Menu>
        <Logo
          src={`${process.env.PUBLIC_URL}/codingcoach-logo-192.png`}
          alt="Logo"
        />
        <MenuItem to="/me/home" icon={IconHome} label="Home" />
        <MenuItem to="/" icon={IconMentors} label="Mentors" />
        <Logout onClick={auth.doLogout}>
          <IconLogout />
          <Label>{messages.LOGOUT}</Label>
        </Logout>
      </Menu>
    </>
  );
};

export default Navbar;
export const mobileNavHeight = 74;

const Menu = styled.nav`
  position: fixed;
  left: 0;
  background-color: #fff;
  overflow-x: hidden;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);

  @media ${desktop} {
    height: 100%;
    width: 75px;
    top: 0;
  }

  @media ${mobile} {
    height: ${mobileNavHeight}px;
    width: 100%;
    bottom: 0;
    display: flex;
    align-items: center;

    > * {
      flex: 1;
    }
  }
`;

const NavItemDecoration = styled(Link)`
  display: block;
  text-align: center;
  text-decoration: none;

  @media ${desktop} {
    margin-bottom: 38px;
  }

  > svg {
    width: 44px;
  }
`;

const Logo = styled.img`
  height: 79px;
  width: 75px;
  margin-bottom: 70px;

  @media ${mobile} {
    display: none;
  }
`;

const Label = styled.div`
  color: #4a4a4a;
`;

const Logout = styled(NavItemDecoration)`
  @media ${desktop} {
    position: absolute;
    bottom: 0;
    width: 100%;
    margin-bottom: 10px;
  }
`;
