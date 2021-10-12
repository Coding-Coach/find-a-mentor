// https://create-react-app.dev/docs/running-tests/#initializing-test-environment
import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';

// https://github.com/facebook/create-react-app/issues/10126#issuecomment-735272763
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(), // Deprecated
  removeListener: jest.fn(), // Deprecated
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});
