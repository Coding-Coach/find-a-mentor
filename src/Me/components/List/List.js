import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import ListItem from './ListItem';

const Style = {
  List: styled.ul`
    padding: 0;
  `,
};

export const List = ({ items, children }) => {
  const _items = useMemo(
    () =>
      items
        ? items.map(item => (
            <ListItem {...item} key={`${item.type}${item.value}`} />
          ))
        : children,
    [children, items]
  );

  return <Style.List>{_items}</Style.List>;
};

//This will allow us to use ListItem as <List.Item ... />
List.Item = ListItem;

List.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      ...ListItem.propTypes,
    })
  ),
  children: ({ children, items }) => {
    if (!children) return;
    if (items)
      return new Error(
        `Warning: Items not allowed to be passed alongside children`
      );
    const isValid = children.length
      ? !children.some(({ type }) => type !== List.Item)
      : children.type === List.Item;
    if (!isValid) return new Error(`List only support List.Item`);
  },
};

export default List;
