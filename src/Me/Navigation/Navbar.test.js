import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import Navbar from './Navbar';

jest.mock('@auth0/auth0-spa-js');

describe('Navbar', () => {
  test('Navbar renders', () => {
    const { getByText } = render(
      <Router>
        <Navbar />
      </Router>
    );
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Mentors')).toBeTruthy();
  });
});
