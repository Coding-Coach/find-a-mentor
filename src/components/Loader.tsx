import styled from 'styled-components';

const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

type LoaderProps = {
  className?: string;
};

export const Loader = ({ className }: LoaderProps) => {
  return (
    <i className={`loader fa fa-spinner fa-spin ${className}`} role="status">
      <SrOnly data-testid="loading">Loading...</SrOnly>
    </i>
  );
};
