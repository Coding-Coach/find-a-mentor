import React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';

export default { title: 'Card' };

const CardContainer = styled.div`
  width: 700px;
  padding: 15px;
`;

const Card = styled.div`
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

export const me = () => (
  <CardContainer>
    <Card>
      <Header>
        <h2>Mentor Profile</h2>
        <Edit onEdit={action('clicked')} />
      </Header>
    </Card>
  </CardContainer>
);
