import React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';

const CardContainer = styled.div`
  background-color: #ffffff;
  -webkit-box-shadow: 4px 4px 9px -3px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 4px 4px 9px -3px rgba(0, 0, 0, 0.75);
  box-shadow: 4px 4px 9px -3px rgba(0, 0, 0, 0.75);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 14px 20px 14px;
`;

const EditButton = styled.button`
  background-color: transparent;
  border: none;
  text-decoration: underline;
  color: #4f4f4f;
`;

const Edit = ({ onEdit }) => {
  return onEdit ? <EditButton onClick={onEdit}>Edit</EditButton> : null;
};

const Card = ({ title, onEdit }) => (
  <CardContainer>
    <Header>
      <h2>{title}</h2>
      <Edit onEdit={onEdit} />
    </Header>
  </CardContainer>
);

export default Card;
