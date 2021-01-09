import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App/App';
import { act } from 'react-dom/test-utils';
import nock from 'nock';
import { UserProvider } from '../context/userContext/UserContext';
import auth from '../utils/auth';

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@auth0/auth0-spa-js');

it('renders without crashing', async () => {
  const mockIsAuthenticated = Promise.resolve(true);
  jest.spyOn(auth, 'isAuthenticated').mockReturnValueOnce(mockIsAuthenticated);
  nock('https://api.codingcoach.io/mentors')
    .get()
    .reply(() => []);
  jest.useFakeTimers();
  const div = document.createElement('div');
  act(() => {
    ReactDOM.render(
      <UserProvider>
        <App />
      </UserProvider>,
      div
    );
    jest.runAllTimers();
  });
  expect(div.querySelector('.app')).toBeDefined();
  await act(() => mockIsAuthenticated);
  // TODO
  // expect(div.querySelectorAll('.card').length).toBe(1);
});
