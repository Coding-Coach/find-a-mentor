import React, { ReactElement } from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';

type LinkProps = React.PropsWithChildren<NextLinkProps> & {
  className?: string;
};

const isA = (element: React.ReactNode) => {
  return (
    React.isValidElement(element) &&
    (element.type === 'a' ||
      /* styled.a */ (element.type as any).target === 'a')
  );
};

const hasATag = (children: LinkProps['children']) => {
  if (typeof children !== 'object') {
    return false;
  }
  if (isA(children)) {
    return true;
  }
  return React.Children.toArray(
    (children as ReactElement).props?.children
  )?.some(hasATag);
};

const Link = (props: LinkProps) => {
  const { children, className, ...rest } = props;
  const hasA = hasATag(props.children);

  return (
    <NextLink {...rest}>
      {
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        hasA ? children : <a className={className}>{children}</a>
      }
    </NextLink>
  );
};

export default Link;
