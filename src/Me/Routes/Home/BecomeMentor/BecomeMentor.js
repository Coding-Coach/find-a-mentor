import React from 'react';
import styled from 'styled-components';

import Card from '../../../components/Card';
import Button from '../../../components/Button';
import illustration from '../../../../assets/me/become-mentor.svg';

const Image = styled.img`
  display: block;
  width: 60%;
  margin: 0 auto 22px auto;
`;
const P = styled.p`
  margin: 0 0 1rem 0;
`;

export default function BecomeMentor() {
  return (
    <Card title="Become a Mentor">
      <Image src={illustration} />
      <P>Would you like to join us as a Mentor?</P>
      <Button>Become a Mentor</Button>
    </Card>
  );
}
