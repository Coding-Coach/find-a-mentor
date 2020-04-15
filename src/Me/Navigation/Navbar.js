import React from 'react';
import './Navbar.css';
import { ReactComponent as IconHome } from '../../assets/me/home.svg';
import { ReactComponent as IconMentors } from '../../assets/me/mentors.svg';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <>
      <div className="menu-tablet">
        <div className="logo-left">
          <img
            className="sidenav-logo"
            src={`${process.env.PUBLIC_URL}/codingcoach-logo-192.png`}
            alt=""
          />
        </div>
        <div className="house side-icon">
          <Link to="/me/home" className="icon">
            <IconHome />
            <span className="desc">Home</span>
          </Link>
        </div>
        <div className="mentors side-icon">
          <Link to="/" className="icon">
            <IconMentors />
            <span className="desc">Mentors</span>
          </Link>
        </div>
      </div>
      <div className="bar">
        <Link to="/me/home" className="icon">
          <IconHome />
          <span className="desc">Home</span>
        </Link>
        <div className="icon">
          <Link to="/" className="icon">
            <IconMentors />
            <span className="desc">Mentors</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
