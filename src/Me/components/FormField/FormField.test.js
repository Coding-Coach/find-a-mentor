import React from 'react';
import FormField from './';
import { render } from '@testing-library/react';
import { formFieldContext } from './formContext';

describe('FormField component', () => {
  it('renders properly', () => {
    const { container } = render(
      <FormField label="test label" helpText="help text" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders the label when it is defined', () => {
    const { getByText } = render(<FormField label="test label" />);
    expect(getByText('test label')).toBeInTheDocument();
  });
  it('passes down the id', () => {
    let formFieldId;
    render(
      <FormField>
        <formFieldContext.Consumer>
          {(id) => (formFieldId = id)}
        </formFieldContext.Consumer>
      </FormField>
    );
    expect(formFieldId).toMatch('form-field-');
  });
});
