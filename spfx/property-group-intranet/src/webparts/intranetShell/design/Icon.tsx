import * as React from 'react';
import { iconPaths, IIconProps } from './icons';

const Icon: React.FunctionComponent<IIconProps> = ({ name, size = 20, className }) => {
  const d = iconPaths[name];
  if (!d) {
    return null;
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
};

export default Icon;
