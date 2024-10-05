import * as React from "react";

import { cn } from "@/libs/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
  onStartIconClick?: () => void;
  onEndIconClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      startIcon,
      endIcon,
      onStartIconClick,
      onEndIconClick,
      ...props
    },
    ref
  ) => {
    const endProps = React.isValidElement(startIcon)
      ? {
          ...((endIcon.props as {}) ?? {}), // Merge existing props
          className: cn(
            endIcon.props.className ?? "",
            `w-4 h-4 text-foreground-faded`
          ),
        }
      : {};
    const startPropIcon = React.isValidElement(endIcon)
      ? {
          ...((startIcon.props as {}) ?? {}), // Merge existing props
          className: cn(
            startIcon.props.className ?? "",
            `w-4 h-4 text-foreground-faded`
          ),
        }
      : {};
    return (
      <div className="w-full relative flex items-center">
        {startIcon && (
          <button
            className="absolute left-3 text-center transition-all disabled:pointer-events-none disabled:opacity-50"
            type="button"
            onClick={onStartIconClick}
          >
            {React.isValidElement(startIcon) &&
              React.cloneElement(startIcon, startPropIcon)}
          </button>
        )}
        <input
          type={type}
          className={cn(
            "w-full py-2 rounded-sm bg-background placeholder:text-foreground-faded border border-border-faded transition duration-300 ease focus:outline-none focus:border-border-primary",
            startIcon && "pl-9",
            endIcon && "pr-9",
            !endIcon && !startIcon && "px-3",
            className
          )}
          ref={ref}
          {...props}
        />
        {endIcon && (
          <button
            className="absolute right-3 text-center transition-all disabled:pointer-events-none disabled:opacity-50"
            type="button"
            onClick={onEndIconClick}
          >
            {React.isValidElement(endIcon) &&
              React.cloneElement(endIcon, endProps)}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
