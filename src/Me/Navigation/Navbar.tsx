import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import auth from '../../utils/auth';
import { mobile, desktop } from '../styles/shared/devices';
import messages from '../../messages';
import styled from 'styled-components/macro';
import { ReactComponent as IconHome } from '../../assets/me/home.svg';
import { ReactComponent as Mentorships } from '../../assets/me/icon-survey.svg';
import { ReactComponent as IconMentors } from '../../assets/me/mentors.svg';
import { ReactComponent as IconLogout } from '../../assets/me/icon-door-exit.svg';

const MenuItem = ({
  icon: Icon,
  label,
  to,
}: {
  icon: React.FunctionComponent;
  label: string;
  to: string;
}) => {
  const location = useLocation();
  return (
    <NavItemDecoration
      className={classNames({ active: location.pathname === to })}
      to={to}
    >
      <Icon />
      <Label>{label}</Label>
    </NavItemDecoration>
  );
};

const Navbar = () => {
  return (
    <>
      <Menu>
        <Logo
          src={`${process.env.PUBLIC_URL}/codingcoach-logo-192.png`}
          alt="Logo"
        />
        <MenuItem to="/me" icon={IconHome} label="Home" />
        <MenuItem to="/me/requests" icon={Mentorships} label="Mentorships" />
        <MenuItem to="/" icon={IconMentors} label="Mentors" />
        <Logout to={window.location.pathname} onClick={auth.doLogout}>
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
    width: 85px;
    top: 0;
  }

  @media ${mobile} {
    height: ${mobileNavHeight}px;
    width: 100%;
    bottom: 0;
    display: flex;
    align-items: center;
    z-index: 1;

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
  height: auto;
  width: 100%;
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
