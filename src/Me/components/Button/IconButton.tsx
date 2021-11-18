import styled from 'styled-components/macro';
import classNames from 'classnames';

type IconButtonProps = {
  icon: string;
  onClick: () => void;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  color?: string;
  size?: 'sm' | 'lg' | '2x' | '3x';
};

const Button = styled.button`
  background: none;
  cursor: pointer;
`;

export const IconButton = ({ onClick, icon, size, color, buttonProps }: IconButtonProps) => {
  return (
    <Button onClick={onClick} {...buttonProps}>
      {typeof icon === 'string' && (
        <i
          style={{ color }}
          className={classNames(['fa', `fa-${icon}`, { [`fa-${size}`]: size }])}
        />
      )}
    </Button>
  );
};
