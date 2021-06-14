import Textarea from './';
import { render } from '@testing-library/react';

describe('Textarea component', () => {
  it('renders properly', () => {
    const { container } = render(<Textarea placeholder="test" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
