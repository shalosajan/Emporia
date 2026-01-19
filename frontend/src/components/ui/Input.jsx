import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(
  (
    {
      className,
      type = "text",
      label,
      error,
      icon: Icon,
      value,
      onChange,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Icon size={18} />
            </div>
          )}

          <input
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            className={twMerge(
              "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500",
              Icon ? "pl-10" : "",
              error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "",
              className
            )}
            {...rest}
          />
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-500 ml-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
