import { render } from '@testing-library/react';
import React from 'react';
import Button from './';

describe('Button component', () => {
  it('renders primary button by default', () => {
    const { container } = render(
      <Button onClick={() => {}}>primary button</Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders secondary button when specified with skin prop', () => {
    const { container } = render(
      <Button skin="secondary" onClick={() => {}}>
        secondary button
      </Button>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders danger button when specified with skin prop', () => {
    const { container } = render(
      <Button skin="danger" onClick={() => {}}>
        danger button
      </Button>
    );
    expect(container).toMatchSnapshot();
  });

  it('passes down other props to the button tag', () => {
    const { getByTestId } = render(
      <Button data-testid="test-button" onClick={() => {}}>
        click me
      </Button>
    );
    expect(getByTestId('test-button')).toBeInTheDocument();
  });
});
