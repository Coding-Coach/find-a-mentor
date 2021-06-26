import { useState } from 'react';
import 'styled-components/macro';
import RadioButton, { RadioButtonGroup } from '../Me/components/RadioButton';
import { RadioButtonGroupProps } from '../Me/components/RadioButton/RadioButtonGroup';
import { StoriesContainer } from './StoriesContainer';
import { action } from '@storybook/addon-actions';

const Docs = () => (
  <>
    <h1>RadioButton</h1>
    <div>
      The `RadioButton` component is a specialized component that brings
      cross-browser consistency to the appearance of the RadioButton instead of
      letting each browser do as they please, visually. To accomplish this,
      we've wrapped some custom HTML and SVG around a primitive `
      <input type="radio" />` element, and then hide the underlying radio
      button. With the exception of a `LabelComponent` prop, all props are
      forwarded to the underlying `input` primitive.
    </div>
  </>
);

export default {
  title: 'RadioButton',
  component: RadioButton,
  parameters: {
    docs: {
      page: Docs,
    },
    handles: ['change'],
  },
};

const actionHandler = action('onChange', {
  clearOnStoryChange: true,
});

export const Checked = () => (
  <StoriesContainer>
    <RadioButton
      checked={true}
      LabelComponent={
        <span>
          Checked <b>label with bold text</b> !
        </span>
      }
    />
  </StoriesContainer>
);

export const UnChecked = () => (
  <StoriesContainer>
    <RadioButton
      checked={false}
      LabelComponent={
        <span>
          Checked <b>label with bold text</b> !
        </span>
      }
    />
  </StoriesContainer>
);

export const List = () => {
  const [value, setValue] = useState('2');
  const onChange: RadioButtonGroupProps['onChange'] = optionValue => {
    actionHandler(optionValue);
    setValue(optionValue);
  };
  return (
    <StoriesContainer>
      <RadioButtonGroup value={value} onChange={onChange}>
        <RadioButton name="options" value="1" LabelComponent="Option 1" />
        <RadioButton name="options" value="2" LabelComponent="Option 2" />
        <RadioButton name="options" value="3" LabelComponent="Option 3" />
      </RadioButtonGroup>
    </StoriesContainer>
  );
};

// ## List

// <Canvas>
//   <Story name="List">
//     {() => {
//       const [groupValue, setGroupValue] = useState(2);
//       const onChange = (e) => {
//         console.log(e);
//         setGroupValue(e.target.value);
//       }
//       const isChecked = (value) => {
//         console.log(545454545, value, value === groupValue)
//         return value === groupValue;
//       }
//       return <>
//         <RadioButton
//           name="options"
//           value={1}
//           LabelComponent="Option 1"
//           onChange={onChange}
//           checked={isChecked(1)}
//         />
//         <RadioButton
//           name="options"
//           value={2}
//           LabelComponent="Option 2"
//           onChange={onChange}
//           checked={isChecked(2)}
//         />
//         <RadioButton
//           name="options"
//           value={3}
//           LabelComponent="Option 3"
//           onChange={onChange}
//           checked={isChecked(3)}
//         />
//       </>
//     }}
//   </Story>
// </Canvas>
