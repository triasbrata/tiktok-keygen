import classNames from 'classnames';
import React, { ReactNode } from 'react';

interface IControlButtonProps {
  name: string;
  path?: string;
  title: string;
  svgIcon?: ReactNode;
}

const ControlButton: React.FC<
  IControlButtonProps & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
  const { name, path, title, svgIcon, ...rest } = props;
  const { onClick } = rest;

  const className = classNames('control', name);

  return (
    <div
      aria-label={name}
      className={className}
      onClick={onClick}
      title={title}
      {...rest}
    >
      {path ? (
        <svg aria-hidden='true' version='1.1' width='10' height='10'>
          <path fill='currentColor' d={path} />
        </svg>
      ) : (
        svgIcon
      )}
    </div>
  );
};

export default ControlButton;
