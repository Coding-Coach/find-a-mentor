import React from 'react';
import Button from './';
import { render } from '@testing-library/react';

describe('Button component', () => {
  it('renders primary button by default', () => {
    const { container } = render(<Button />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders secondary button when specified with skin prop', () => {
    const { container } = render(<Button skin="secondary" />);
    expect(container).toMatchSnapshot();
  });

  it('passes down other props to the button tag', () => {
    const { getByTestId } = render(<Button data-testid="test-button" />);
    expect(getByTestId('test-button')).toBeInTheDocument();
  });
});
