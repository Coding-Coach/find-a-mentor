import React from 'react';
import './Header.css';
import Logo from './Logo';

const Header = () => {
  return (
    <div className="header-large">
      <div className="rectangle">
        <div className="home">Home</div>
        <div className="logo">
          <Logo />
        </div>
      </div>
    </div>
  );
};

export default Header;
