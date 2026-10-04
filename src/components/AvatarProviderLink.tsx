import { Tooltip } from 'react-tippy';
import styled from 'styled-components';

type AvatarProviderLinkProps = {
  href: string;
  title: string;
};

const AvatarProviderLink = ({ href, title }: AvatarProviderLinkProps) => (
  <Tooltip title={title} size="small" arrow={true}>
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={title}
    >
      <i className="fa fa-external-link" aria-hidden="true" />
    </Link>
  </Tooltip>
);

const Link = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.92);
  color: #6b7280;
  border: 1px solid rgba(120, 128, 140, 0.16);
  box-shadow: 0 2px 6px rgba(17, 22, 26, 0.08);
  text-decoration: none;

  &:hover {
    color: #4f4f4f;
    background: #fff;
  }
`;

export default AvatarProviderLink;
