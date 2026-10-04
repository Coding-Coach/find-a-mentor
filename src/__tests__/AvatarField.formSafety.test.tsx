import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AvatarField from '../components/MemberArea/AvatarField';
import { useFaceDetection } from '../hooks/useFaceDetection';

jest.mock('../hooks/useFaceDetection', () => ({
  useFaceDetection: jest.fn(),
}));

jest.mock('../helpers/authProvider', () => ({
  isGoogleOAuthUser: jest.fn(() => true),
}));

describe('AvatarField inside a form', () => {
  it('does not submit the surrounding form when switching to Gravatar', () => {
    (useFaceDetection as jest.Mock).mockReturnValue({
      faceDetected: false,
      isChecking: false,
      status: 'not-detected',
    });
    const onSubmit = jest.fn((e: React.FormEvent) => e.preventDefault());
    const onToggleGravatar = jest.fn();

    render(
      <form onSubmit={onSubmit}>
        <AvatarField
          user={
            {
              auth0Id: 'google-oauth2|123',
              avatar: 'https://example.com/avatar.jpg',
              auth0Picture: undefined,
            } as any
          }
          isUsingGravatar={false}
          onToggleGravatar={onToggleGravatar}
        />
      </form>
    );

    fireEvent.click(screen.getByText(/switch to Gravatar/i));

    expect(onToggleGravatar).toHaveBeenCalledWith(true);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
