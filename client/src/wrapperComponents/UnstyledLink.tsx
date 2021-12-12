import { LocationDescriptorObject } from 'history';
import { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

type PropsType = {
  children: React.ReactChild;
  to: string | LocationDescriptorObject;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
};

const UnstyledLink: React.SFC<PropsType> = ({
  children,
  to,
  style = {},
  className = '',
  onClick,
}) => {
  return (
    <Link
      className={`${className}`}
      to={to}
      style={{
        ...style,
        textDecoration: 'none',
      }}
      onClick={() => onClick?.()}
    >
      {children}
    </Link>
  );
};

export default UnstyledLink;
