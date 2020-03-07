import React from 'react';
import styled from 'styled-components';
import Card from '../Me/components/Card';

export default { title: 'Card' };

const CardContainer = styled.div`
  width: 700px;
  padding: 15px;
`;

const action = () => console.log('Clicked');

export const me = () => (
  <CardContainer>
    <Card title="Mentor Profile" onEdit={action} />
  </CardContainer>
);
