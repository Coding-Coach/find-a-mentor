import React from 'react';
import styled from 'styled-components';
import Card from '../Me/components/Card';

export default { title: 'Profile Card' };

const CardContainer = styled.div`
  width: 375px;
  padding: 15px;
`;

// eslint-disable-next-line no-console
const action = () => console.log('Clicked');

export const empty = () => (
  <CardContainer>
    <Card title="Mentor Profile" onEdit={action} />
  </CardContainer>
);
export const withChildren = () => (
  <CardContainer>
    <Card title="Mentor Profile" onEdit={action}>
      <div>
        <p>This is an example of a list inside a card</p>
        <ul>
          <li>First item</li>
          <li>2nd item</li>
          <li>3rd item</li>
          <li>4th item</li>
        </ul>
      </div>
    </Card>
  </CardContainer>
);
