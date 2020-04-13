import React from 'react';
import Input from './';
import { render } from '@testing-library/react';

describe('Input component', () => {
  it('renders properly', () => {
    const { container } = render(<Input placeholder="test" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
