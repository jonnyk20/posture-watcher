import { ReactElement } from 'react';
import { CSSProperties } from 'react';

type PropsType = {
  href: string;
  children: ReactElement | string;
  onClick?: () => void;
  shouldOpenOnSamePage?: boolean;
  styles?: CSSProperties;
};

const ExternalLink: React.FC<PropsType> = ({
  href,
  children,
  styles = {},
  onClick,
  shouldOpenOnSamePage,
}) => {
  const defaultStyles: CSSProperties = {
    color: 'inherit',
    textDecoration: 'none',
  };

  let linkBehaviorProps: { target?: string; rel?: string } = {
    rel: 'noopener noreferrer',
    target: '_blank',
  };

  if (shouldOpenOnSamePage) {
    linkBehaviorProps = {};
  }

  return (
    <a
      style={{ ...defaultStyles, ...styles }}
      href={href}
      onClick={onClick}
      {...linkBehaviorProps}
    >
      {children}
    </a>
  );
};

export default ExternalLink;
