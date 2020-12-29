import PropTypes from 'prop-types';
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import RichItem from './RichItem';

const Style = {
  List: styled.ul`
    padding: 0;
  `,
};

export const RichList = ({ items }) => {
  const [state, setState] = useState('');
  const renderItems = ({ id, ...item }) => (
    <RichItem
      {...item}
      key={id}
      onClick={() => {
        setState(state === id ? '' : id);
      }}
      expand={state === id && item.children}
    >
      {item.children}
    </RichItem>
  );

  const listItems = useMemo(() => items?.map(renderItems), [state]);

  return <Style.List>{listItems}</Style.List>;
};

RichList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      ...RichItem.propTypes,
      id: PropTypes.string.isRequired,
    })
  ),
};

export default RichList;
