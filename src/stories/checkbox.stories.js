import React, { useState } from 'react';
import 'styled-components/macro';

import FormField from '../Me/components/FormField';
import Checkbox from '../Me/components/Checkbox';
import { StoriesContainer } from './StoriesContainer';

export default { title: 'Checkbox' };

export const Availability = () => {
  const [isChecked, setIsChecked] = useState();

  return (
    <StoriesContainer>
      <h1>Update Profile</h1>
      <FormField label="Availability" css={{ width: '60%' }}>
        <Checkbox
          name="availability"
          value="checked"
          checked={isChecked}
          LabelComponent={
            <span>
              Checked <b>label with bold text</b> !
            </span>
          }
          onChange={e => setIsChecked(!isChecked)}
        />
      </FormField>
    </StoriesContainer>
  );
};
