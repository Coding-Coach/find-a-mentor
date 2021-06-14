import { render } from '@testing-library/react';
import List from './';
import { ListItemProps } from './ListItem';

describe('List component', () => {
  const items: ListItemProps[] = [
    {
      type: 'email',
      value: 'myemail@codecoache.com',
    },
    {
      type: 'title',
      value: 'front-end',
    },
  ];

  it('Should render children as ListItem', () => {
    const itemsComp = [
      <List.Item {...items[0]} />,
      <List.Item {...items[1]} />,
    ];
    const { getByTestId, getByText, rerender } = render(
      <List>{itemsComp[0]}</List>
    );
    getByTestId(items[0].type);
    getByText(items[0].value);

    rerender(
      <List>
        {itemsComp[0]}
        {itemsComp[1]}
      </List>
    );

    getByTestId(items[1].type);
    getByText(items[1].value);
  });

  it('Should  render props.items as ListItem', async () => {
    const { findAllByText } = render(<List items={items} />);
    const rgx = new RegExp(`(${items[0].value}|${items[1].value})`);
    const els = await findAllByText(rgx);

    expect(els.length).toEqual(2);
  });
});
