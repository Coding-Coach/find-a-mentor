import CancelModal from '../CancelModal';
import { action } from '@storybook/addon-actions';
import { StoriesContainer } from '../../../../stories/StoriesContainer';

export default {
  title: 'Mentorship/Canceled',
  component: CancelModal,
};

const onSave = action('onSave');
const onClose = action('onClose');

export const Default = () => (
  <StoriesContainer>
    <CancelModal username="John Doe" onSave={onSave} onClose={onClose} />
  </StoriesContainer>
);
