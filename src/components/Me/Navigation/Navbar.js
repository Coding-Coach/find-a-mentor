import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <div>
      <div className="menu-tablet">
        <div className="logo-left">
          <img
            class="sidenav-logo"
            src={`${process.env.PUBLIC_URL}/codingcoach-logo-192.png`}
            alt=""
          />
        </div>
        <div className="house side-icon">
          <img src={`${process.env.PUBLIC_URL}/images/icons/Home.png`} alt="" />
        </div>
        <div className="mentors side-icon">
          <img
            src={`${process.env.PUBLIC_URL}/images/icons/Mentors.png`}
            alt=""
          />
        </div>
      </div>
      <div className="bar">
        <div className="icon">
          <img src={`${process.env.PUBLIC_URL}/images/icons/Home.png`} alt="" />
        </div>
        <div className="icon">
          <img
            src={`${process.env.PUBLIC_URL}/images/icons/Mentors.png`}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
