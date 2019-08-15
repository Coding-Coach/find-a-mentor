import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App/App';
import { act } from 'react-dom/test-utils';
import nock from 'nock';

it('renders without crashing', () => {
  nock('https://api.codingcoach.io/mentors')
    .get()
    .reply(() => []);
  jest.useFakeTimers();
  const div = document.createElement('div');
  act(() => {
    ReactDOM.render(<App />, div);
    jest.runAllTimers();
  });
  expect(div.querySelector('.app')).toBeDefined();
  // TODO
  // expect(div.querySelectorAll('.card').length).toBe(1);
});
