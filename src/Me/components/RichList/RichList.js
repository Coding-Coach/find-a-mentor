import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import RichItem from './RichItem';

const Style = {
  List: styled.ul`
    padding: 0;
    margin: 0;
  `,
};

export const RichList = ({ items, closeOpenItem }) => {
  const [state, setState] = useState('');
  const renderItems = ({ id, ...item }) => (
    <i key={id}>
      <RichItem
        {...item}
        onClick={() => {
          item.children && setState(state === id ? '' : id);
        }}
        expand={state === id}
      >
        {item.children}
      </RichItem>
    </i>
  );

  useEffect(() => {
    if (closeOpenItem) setState('');
  }, [closeOpenItem]);

  return <Style.List>{items?.map(renderItems)}</Style.List>;
};

RichList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      ...RichItem.propTypes,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ),
  closeOpenItem: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
};

export default RichList;
