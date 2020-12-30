import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import RichItem from './RichItem';

const Style = {
  List: styled.ul`
    padding: 0;
    margin: 0;
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
      expand={state === id}
    >
      {item.children}
    </RichItem>
  );

  return <Style.List>{items?.map(renderItems)}</Style.List>;
};

RichList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      ...RichItem.propTypes,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ),
};

export default RichList;
