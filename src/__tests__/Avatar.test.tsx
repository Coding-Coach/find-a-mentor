import { render, screen } from '@testing-library/react';
import Avatar from '../Me/Routes/Home/Avatar/Avatar';

jest.mock('../hooks/useFaceDetection', () => ({
  useFaceDetection: jest.fn(),
}));

jest.mock('../helpers/authProvider', () => ({
  isGoogleOAuthUser: jest.fn(() => true),
}));

jest.mock('../context/userContext/UserContext', () => ({
  useUser: () => ({
    currentUser: {
      _id: 'u1',
      name: 'Test User',
      title: 'Tester',
      // 1x1 transparent PNG data URI so jsdom renders an <img>
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=',
      email: 'test@example.com',
      auth0Id: 'google-oauth|123',
    },
    updateCurrentUser: jest.fn(),
  }),
}));

// Mock ApiContext useApi so tests don't need the provider
jest.mock('../context/apiContext/ApiContext', () => ({
  useApi: () => ({
    toggleAvatar: jest.fn(),
    clearCurrentUser: jest.fn(),
  }),
}));

import { useFaceDetection } from '../hooks/useFaceDetection';

describe('Avatar component', () => {
  it('shows non-face warning when faceDetected is false', () => {
    (useFaceDetection as jest.Mock).mockReturnValue({ faceDetected: false, isChecking: false, status: 'not-detected' });

    render(<Avatar />);

    expect(screen.getByText((content) => content.includes('Please use a real'))).toBeInTheDocument();
  });
});
