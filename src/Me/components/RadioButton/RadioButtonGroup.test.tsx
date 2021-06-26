import { render } from '@testing-library/react';
import RadioButton from '.';
import RadioButtonGroup from './RadioButtonGroup';

describe('RadioButtonGroup', () => {
  it('should call onChange when check an option', async () => {
    const onChange = jest.fn();

    const { findByText } = render(
      <RadioButtonGroup value="2" onChange={onChange}>
        <RadioButton name="options" value="1" LabelComponent="Option 1" />
        <RadioButton name="options" value="2" LabelComponent="Option 2" />
        <RadioButton name="options" value="3" LabelComponent="Option 3" />
      </RadioButtonGroup>
    );
    (await findByText('Option 3')).click();

    expect(onChange).toHaveBeenCalledWith('3');
  });

  it('should match snapshot', () => {
    const { container } = render(
      <RadioButtonGroup value="2" onChange={() => {}}>
        <RadioButton name="options" value="1" LabelComponent="Option 1" />
        <RadioButton name="options" value="2" LabelComponent="Option 2" />
        <RadioButton name="options" value="3" LabelComponent="Option 3" />
      </RadioButtonGroup>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
