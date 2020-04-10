import React from 'react';
import styled from 'styled-components';
import { desktop } from '../../styles/shared/devices';
import PropTypes from 'prop-types';

const StyledButton = styled.button`
  height: 30px;
  width: 285px;
  border-radius: 3px;
  font-family: Lato;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  margin-bottom: 1rem;
  cursor: pointer;

  @media ${desktop} {
    height: 30px;
    width: 151px;
    margin: 1rem;
  }
`;

const PrimaryButton = styled(StyledButton)`
  background-color: #69d5b1;
  color: #fff;
  font-family: Lato;
  font-size: 14px;
`;

const SecondaryButton = styled(StyledButton)`
  box-sizing: border-box;
  background-color: #fff;
  border: 2px solid #69d5b1;
  color: #69d5b1;
`;

export const Button = ({ skin = 'primary', ...props }) => {
  return (
    <>
      {skin === 'secondary' ? (
        <SecondaryButton {...props} />
      ) : (
        <PrimaryButton {...props} />
      )}
    </>
  );
};

Button.propTypes = {
  skin: PropTypes.oneOf(['primary', 'secondary']),
};
