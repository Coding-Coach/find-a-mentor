import React, { useState } from 'react';
import 'styled-components/macro';
import Select from '../Me/components/Select';
import FormField from '../Me/components/FormField';

import { StoriesContainer } from './StoriesContainer';

export default { title: 'Select' };
const options = [
  { value: 1, label: 'one' },
  { value: 2, label: 'two' },
  { value: 3, label: 'three' },
];

export const SingleSelect = () => {
  const [selectedValues, setSelectedValues] = useState();

  return (
    <StoriesContainer>
      <FormField label="Single select" css={{ width: '60%' }}>
        <Select
          value={selectedValues}
          onChange={(selected) => {
            setSelectedValues(selected);
          }}
          options={options}
          placeholder="Select a number"
        />
      </FormField>
    </StoriesContainer>
  );
};

export const MultiSelect = () => {
  const [selectedValues, setSelectedValues] = useState();

  return (
    <StoriesContainer>
      <FormField label="Multi select" css={{ width: '60%' }}>
        <Select
          isMulti={true}
          value={selectedValues}
          onChange={(selected) => {
            setSelectedValues(selected);
          }}
          options={options}
          placeholder="Select a number"
        />
      </FormField>
    </StoriesContainer>
  );
};

export const MultiSelectWithMaxItems = () => {
  const [selectedValues, setSelectedValues] = useState();

  return (
    <StoriesContainer>
      <FormField label="Multi select" css={{ width: '60%' }}>
        <Select
          isMulti={true}
          value={selectedValues}
          onChange={(selected) => {
            setSelectedValues(selected);
          }}
          options={options}
          maxSelections={2}
          placeholder="Select a number"
        />
      </FormField>
    </StoriesContainer>
  );
};
