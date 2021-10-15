import AcceptModal from '../AcceptModal';
import { action } from '@storybook/addon-actions';
import { StoriesContainer } from '../../../../stories/StoriesContainer';

export default {
  title: 'Mentorship/Approved',
  component: AcceptModal,
};

const onClose = action('onClose');

export const Default = () => (
  <StoriesContainer>
    <AcceptModal username="John Doe" menteeEmail="john@johndoe.com" onClose={onClose} />
  </StoriesContainer>
);
