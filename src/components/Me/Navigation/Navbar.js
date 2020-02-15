import React from 'react';
import './Navbar.css';
import IconHome from './IconHome';
import IconMentors from './IconMentors';

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
          <a href="/" className="icon">
            <div>
              <IconHome />
              <span className="desc">Home</span>
            </div>
          </a>
        </div>
        <div className="mentors side-icon">
          <a href="#" className="icon">
            <div>
              <IconMentors />
              <span className="desc">Mentors</span>
            </div>
          </a>
        </div>
      </div>
      <div className="bar">
        <a href="/" className="icon">
          <div>
            <IconHome />
            <span className="desc">Home</span>
          </div>
        </a>
        <div className="icon">
          <IconMentors />
          <span className="desc">Mentors</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
