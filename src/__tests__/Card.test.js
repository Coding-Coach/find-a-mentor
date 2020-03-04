import React from 'react';
import Card from '../Me/components/Card';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Card component', () => {
  it('render card just title', () => {
    const title = 'mentor';
    const { getByText } = render(<Card title={title} />);
    expect(getByText('mentor')).toBeInTheDocument();
  });

  it('render card with Edit button', () => {
    const title = 'mentor';
    const { getByText } = render(<Card title={title} onEdit={() => null} />);
    expect(getByText('mentor')).toBeInTheDocument();
    expect(getByText('Edit')).toBeInTheDocument();
  });
});
