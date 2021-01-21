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

export const RichList = ({ render, closeOpenItem }) => {
  const [state, setState] = useState('');

  useEffect(() => {
    if (closeOpenItem) setState('');
  }, [closeOpenItem]);

  const onSelect = id => {
    setState(state === id ? '' : id);
  };

  return <Style.List>{render({ onSelect, expandId: state })}</Style.List>;
};

RichList.propTypes = {
  render: PropTypes.func.isRequired,
  closeOpenItem: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
};

export default RichList;
