import { render } from '@testing-library/react';
import Switch from './Switch';

describe('Switch component', () => {
  it('renders properly', () => {
    const { container } = render(
      <Switch label="label" onToggle={() => {}} isChecked={false} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should call onToggle on click', () => {
    const onToggle = jest.fn();

    const { getByLabelText } = render(
      <Switch label="label" onToggle={onToggle} isChecked={false} />
    );
    getByLabelText('Toggle').click();
    expect(onToggle).toHaveBeenCalledWith(true);
  });
});
