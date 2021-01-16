import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export function Loader({ className }) {
  return (
    <i className={`loader fa fa-spinner fa-spin ${className}`} role="status">
      <SrOnly>Loading...</SrOnly>
    </i>
  );
}

Loader.propTypes = {
  className: PropTypes.string,
};
