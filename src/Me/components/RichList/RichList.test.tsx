import { fireEvent, render, waitFor } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { RichList, RichItem } from '.';
import { RichItemProps } from './ReachItemTypes';
import { useExpendableRichItems } from './RichList';

const items: PropsWithChildren<Omit<RichItemProps, 'onClick'>>[] = [
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
    children: <h1>123</h1>,
    expand: false,
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
    children: <h1>456</h1>,
    expand: false,
  },
];

describe('RichList component', () => {
  it('Should render 2 items', async () => {
    const { findAllByText } = render(
      <RichList>
        {items.map(item => (
          <RichItem {...item} key={item.id} onClick={() => {}} />
        ))}
      </RichList>
    );
    const rgx = new RegExp(`${items[0].title}|${items[1].title}`);
    const itemsEl = await findAllByText(rgx);

    expect(itemsEl.length).toBe(2);
  });

  it('Should show/hide children content on item click', async () => {
    const RichListWrapper = () => {
      const { expandId, onSelect } = useExpendableRichItems();
      return (
        <RichList>
          {items.map(item => (
            <RichItem
              {...item}
              key={item.id}
              onClick={onSelect}
              expand={item.id === expandId}
            />
          ))}
        </RichList>
      );
    };
    const { id, title } = items[0];
    const { getByText, queryByText } = render(<RichListWrapper />);

    const titleEl = getByText(title);

    fireEvent.click(titleEl);

    getByText(id);

    fireEvent.click(titleEl);

    await waitFor(() => {
      expect(queryByText(id)).not.toBeVisible();
    });
  });
});
