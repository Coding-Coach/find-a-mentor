import React from 'react';
import Card from '../Me/components/Card';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Card component', () => {
  it('render card just title', () => {
    const title = 'mentor';
    const { getByText } = render(<Card title={title} />);
    expect(getByText('mentor')).toBeInTheDocument();
  });

  it('render card with Edit button', () => {
    const title = 'mentor';
    const editFn = jest.fn();
    const { getByText } = render(<Card title={title} onEdit={editFn} />);
    expect(getByText('mentor')).toBeInTheDocument();
    const editButton = getByText('Edit');
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    expect(editFn).toHaveBeenCalled();
  });
});
