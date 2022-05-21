import React, { useState } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import styled from 'styled-components/macro';

import Link from '../../components/Link/Link';
import { mobile, desktop } from '../styles/shared/devices';
import messages from '../../messages';
import IconHome from '../../assets/me/home.svg';
import Mentorships from '../../assets/me/icon-survey.svg';
import IconMentors from '../../assets/me/mentors.svg';
import IconLogout from '../../assets/me/icon-door-exit.svg';
import { useUser } from '../../context/userContext/UserContext';
import { useRoutes } from '../../hooks/useRoutes';
import Tawk from '../Tawk';
const MenuItem = ({
  icon: Icon,
  label,
  to,
  setIsTawkShowing,
  tawkShowing,
}: {
  icon: string;
  label: string;
  to?: string;
  setIsTawkShowing?: (arg0: boolean) => void;
  tawkShowing?: boolean;
}) => {
  const router = useRouter();
  if (to) {
    return (
      <Link href={to}>
        <NavItemDecoration
          className={classNames({ active: router.pathname === to })}
        >
          <Icon />
          <Label>{label}</Label>
        </NavItemDecoration>
      </Link>
    );
  } else
    return (
      <button onClick={() => setIsTawkShowing(!tawkShowing)}>
        <NavItemDecoration
          className={classNames({ active: router.pathname === to })}
        >
          <Icon />
          <Label>{label}</Label>
        </NavItemDecoration>
      </button>
    );
};

const Navbar = () => {
  const [tawkShowing, setIsTawkShowing] = useState(false);
  const { isAdmin, logout } = useUser();
  const urls = useRoutes();
  console.log({ tawkShowing });
  return (
    <>
      {tawkShowing && <Tawk />}
      <Menu>
        <Logo
          src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/codingcoach-logo-192.png`}
          alt="Logo"
        />
        <MenuItem to={urls.me.get()} icon={IconHome} label="Home" />
        <MenuItem
          to={urls.me.requests.get()}
          icon={Mentorships}
          label="Mentorships"
        />
        <MenuItem to={urls.root.get()} icon={IconMentors} label="Mentors" />
        <MenuItem
          icon={IconMentors}
          setIsTawkShowing={setIsTawkShowing}
          tawkShowing={tawkShowing}
          label="Tak"
        />

        {isAdmin && (
          <MenuItem to={urls.me.admin.get()} icon={IconMentors} label="Admin" />
        )}
        <Logout onClick={logout}>
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

const NavItemDecoration = styled.a`
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
function setIsTawkShowing(arg0: boolean): void {
  throw new Error('Function not implemented.');
}
