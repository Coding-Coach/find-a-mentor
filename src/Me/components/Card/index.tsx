import { FC } from 'react';
import styled from 'styled-components';

type CardProps = {
  title?: string;
  onEdit?(): void;
  className?: string;
};

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
  --padding-inline: 14px;

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
    padding-left: var(--padding-inline);
    padding-right: var(--padding-inline);
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

const Edit = ({ onEdit }: Pick<CardProps, 'onEdit'>) => {
  return onEdit ? <EditButton onClick={onEdit}>Edit</EditButton> : null;
};

const Card: FC<CardProps> = ({ title, onEdit, className = '', children }) => (
  <CardContainer className={className}>
    <Header>
      <h4>{title}</h4>
      <Edit onEdit={onEdit} />
    </Header>
    <Content className="card__content">{children}</Content>
  </CardContainer>
);

export default Card;
