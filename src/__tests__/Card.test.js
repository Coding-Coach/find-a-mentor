import React from 'react';
import Card from '../Me/components/Card';
import { render, fireEvent } from '@testing-library/react';

describe('Card component', () => {
  it('render card just title and children', () => {
    const title = 'mentor';
    const { getByText } = render(
      <Card title={title}>
        <p>I'm a children</p>
      </Card>
    );
    expect(getByText('mentor')).toBeInTheDocument();
    expect(getByText("I'm a children")).toBeInTheDocument();
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
