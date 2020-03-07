import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: #ffffff;
  box-shadow: 4px 4px 9px -3px rgba(0, 0, 0, 0.75);
  padding: 20px 14px 20px 14px;

  h4 {
    color: #4A4A4A;
    line-height: 1.2142857143rem;

  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const EditButton = styled.button`
  background-color: transparent;
  border: none;
  text-decoration: underline;
  color: #4f4f4f;
  font-size: 0.8571428571rem;
  font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
`;

const Content = styled.div`
`

const Edit = ({ onEdit }) => {
  return onEdit ? <EditButton onClick={onEdit}>Edit</EditButton> : null;
};

const Card = ({ title, onEdit, children }) => (
  <CardContainer>
    <Header>
      <h4>{title}</h4>
      <Edit onEdit={onEdit} />
    </Header>
    <Content>
      {children}
    </Content>
  </CardContainer>
);

export default Card;
