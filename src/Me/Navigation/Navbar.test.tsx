import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import Navbar from './Navbar';
import { UserProvider } from '../../context/userContext/UserContext';

describe('Navbar', () => {
  test('Navbar renders', () => {
    const { getByText } = render(
      <UserProvider>
        <Router>
          <Navbar />
        </Router>
      </UserProvider>
    );
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Mentors')).toBeTruthy();
  });
});
