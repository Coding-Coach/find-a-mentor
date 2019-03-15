import React from "react";

import SocialLinks from "../SocialLinks/SocialLinks";
import Logo from "../Logo";

const Header = () => (
  <header className="main-header">
    <a className="logo" href="/">
      <Logo width={110} height={50} color="#68d5b1" />
    </a>
    <SocialLinks />
  </header>
);

export default Header;
