import React from 'react';
import Select from './';
import { render } from '@testing-library/react';

const options = [
  { value: 1, label: 'one' },
  { value: 2, label: 'two' },
  { value: 3, label: 'three' },
];
const noop = () => {};

describe('Select component', () => {
  it('renders properly', () => {
    const options = [
      { value: 1, label: 'one' },
      { value: 2, label: 'two' },
      { value: 3, label: 'three' },
    ];
    const { container } = render(
      <Select
        value={[]}
        onChange={noop}
        options={options}
        placeholder="Select a number"
        menuIsOpen
        menuPortalTarget={undefined}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
  it('does not allow to select more items than specified by maxSelections', () => {
    const maxItems = 2;

    const { getByText } = render(
      <Select
        isMulti={true}
        value={options.slice(0, maxItems)}
        onChange={noop}
        options={options}
        maxSelections={maxItems}
        placeholder="Select a number"
        menuIsOpen
        menuPortalTarget={undefined}
      />
    );

    expect(getByText('one')).toBeInTheDocument();
    expect(getByText('two')).toBeInTheDocument();
    expect(getByText('Reached max items')).toBeInTheDocument();
  });
});
