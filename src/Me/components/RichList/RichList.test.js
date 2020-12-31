import { render } from '@testing-library/react';
import React from 'react';
import RichList from '.';

describe('RichList component', () => {
  const items = [
    {
      id: '123',
      avatar: '../../assets/me/mentors.svg',
      title: 'Mooli m',
      subtitle: 'web dev',
      tag: {
        value: 'pending',
        theme: 'secondary',
      },
      info: '3 days ago',
    },
    {
      id: '456',
      avatar: '../../assets/me/camera.svg',
      title: 'Someone',
      subtitle: 'Rock star dev',
      tag: {
        value: 'Accepted',
        theme: 'primary',
      },
      info: '6 days ago',
    },
  ];

  it('Should render 2 items', async () => {
    const { findAllByText } = render(<RichList items={items} />);
    const rgx = new RegExp(`${items[0].title}|${items[1].title}`);
    const itemsEl = await findAllByText(rgx);

    expect(itemsEl.length).toBe(2);
  });
});
