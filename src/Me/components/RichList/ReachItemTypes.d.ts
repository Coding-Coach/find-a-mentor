export type RichItemTagTheme =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'checked'
  | 'disabled';

export type RichItemProps = {
  id: string;
  avatar: string;
  title: string;
  subtitle: string;
  tag: {
    value: string;
    theme: RichItemTagTheme;
  };
  info: string;
  expand: boolean;
  onClick: (id: string) => void;
};
