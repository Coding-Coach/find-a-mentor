import { Mentor } from '../../types/models';

export type CardProps = {
  mentor: Mentor;
  isFav: boolean;
  onAvatarClick?(): void;
  onFavMentor(mentor: Mentor): void;
  appearance: 'extended' | 'compact';
};