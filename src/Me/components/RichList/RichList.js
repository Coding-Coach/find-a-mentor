import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';

const Style = {
  List: styled.ul`
    padding: 0;
    margin: 0;
    list-style: none;
  `,
};

export const RichList = ({ render, closeOpenItem }) => {
  const [expandId, setExpandId] = useState('');

  const onSelect = id => {
    setExpandId(expandId === id ? '' : id);
  };

  return <Style.List>{render({ onSelect, expandId })}</Style.List>;
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
