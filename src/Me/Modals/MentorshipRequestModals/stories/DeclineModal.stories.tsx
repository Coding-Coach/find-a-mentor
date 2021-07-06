import DeclineModal from '../DeclineModal';
import { action } from '@storybook/addon-actions';
import { StoriesContainer } from '../../../../stories/StoriesContainer';

export default {
  title: 'Mentorship/Decline',
  component: DeclineModal,
};

const onClose = action('onClose');
const onSave = action('onSave');

export const Default = () => (
  <StoriesContainer>
    <DeclineModal username="Brent M Clark" onClose={onClose} onSave={onSave} />
  </StoriesContainer>
);
