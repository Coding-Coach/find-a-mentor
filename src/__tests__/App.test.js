import ReactDOM from 'react-dom';
import nock from 'nock';
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import App from '../components/App/App';
import { UserProvider } from '../context/userContext/UserContext';

const API_BASE_URL = 'https://api.codingcoach.io';

it('renders without crashing', async () => {
  nock(API_BASE_URL)
    .options('/mentors')
    .query(true)
    .reply(200)
    .get('/mentors')
    .reply(() => [])
    .get('/current')
    .reply(() => ({}));

  const div = document.createElement('div');
  const history = createMemoryHistory();

  act(() => {
    ReactDOM.render(
      <Router history={history}>
        <UserProvider>
          <App />
        </UserProvider>
      </Router>,
      div
    );
  });
  expect(div.querySelector('.app')).toBeDefined();
  await act(() => Promise.resolve());
});
