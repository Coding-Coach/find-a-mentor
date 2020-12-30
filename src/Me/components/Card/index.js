import React from 'react';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.0714285714rem;
`;

const EditButton = styled.button`
  background-color: transparent;
  border: none;
  text-decoration: underline;
  color: #4f4f4f;
  font-size: 0.8571428571rem;
  font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
  line-height: 1.2142857143rem;
  padding: 0;
  cursor: pointer;
`;

export const Content = styled.div`
  color: #4f4f4f;
  font-family: Lato;
  font-size: 1rem;
  font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
`;

const CardContainer = styled.div`
  position: relative;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
  ${Header} {
    padding-top: 20px;
  }
  ${Content} {
    padding-bottom: 43px;
  }
  ${Header},
  ${Content} {
    padding-left: 14px;
    padding-right: 14px;
  }

  & + & {
    margin-top: 30px;
  }

  h4 {
    color: #4a4a4a;
    line-height: 1.2142857143rem;
    font-weight: bold;
    margin: 0;
  }
`;

const Edit = ({ onEdit }) => {
  return onEdit ? <EditButton onClick={onEdit}>Edit</EditButton> : null;
};

const Card = ({ title, onEdit, children }) => (
  <CardContainer>
    <Header>
      <h4>{title}</h4>
      <Edit onEdit={onEdit} />
    </Header>
    <Content>{children}</Content>
  </CardContainer>
);

export default Card;
