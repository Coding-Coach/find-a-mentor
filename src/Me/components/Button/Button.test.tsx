import { render, fireEvent } from '@testing-library/react';
import Button from './';

describe('Button component', () => {
  it('passes down other props to the button tag', () => {
    const { getByTestId } = render(
      <Button data-testid="test-button" onClick={() => {}}>
        click me
      </Button>
    );
    expect(getByTestId('test-button')).toBeInTheDocument();
  });

  it(`fires 'prop.onClick' upon user click`, () => {
    const onClick = jest.fn(() => {});
    const { getByText } = render(<Button onClick={onClick}>Click Me</Button>);

    const btn = getByText('Click Me');

    fireEvent.click(btn);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
