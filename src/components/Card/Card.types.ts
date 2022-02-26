import { TooltipProps } from 'react-tippy';
import { Mentor } from '../../types/models';

export type CTAButtonProps = {
  tooltipProps: TooltipProps;
  onClick?: () => void;
  text: string;
  link?: string;
};

export type CardProps = {
  mentor: Mentor;
  isFav: boolean;
  onAvatarClick?(): void;
  onFavMentor(mentor: Mentor): void;
  appearance: 'extended' | 'compact';
};
