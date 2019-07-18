import React from 'react';
import styled from 'styled-components';

function Navigation() {
  return (
    <nav id="menu">
      <List>
        <Link href="https://codingcoach.io/">About</Link>
        <Link href="https://docs.google.com/document/d/1zKCxmIh0Sd4aWLiQncICOGm6uf38S0kJ0xb0qErNFVA/edit?usp=sharing">
          How it works
        </Link>
        <Link href="https://github.com/Coding-Coach/find-a-mentor">
          Become a Mentor
        </Link>
      </List>
    </nav>
  );
}

const List = styled.ul`
  list-style: none;
  display: flex;
  @media all and (max-width: 800px) {
    margin-top: 100px;
    flex-direction: column;
  }
`;

const Link = styled.a`
  color: #4a4a4a;
  text-decoration: none;
  padding: 10px;
  font-size: 16px;
  @media all and (max-width: 800px) {
    padding-left: 0;
  }

  &:hover {
    color: #2c2c2c;
  }
`;

export default Navigation;
