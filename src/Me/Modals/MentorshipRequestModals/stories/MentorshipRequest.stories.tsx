import MentorshipRequest from '../MentorshipRequest';
import { StoriesContainer } from '../../../../stories/StoriesContainer';

export default {
  title: 'Mentorship/Request',
  component: MentorshipRequest,
};

export const Default = () => (
  <StoriesContainer>
    <MentorshipRequest mentor="John Doe" />
  </StoriesContainer>
);
