import React from 'react';

import { Select as AntSelect, SelectProps as AntSelectProps } from 'antd';
import { VariantProps, cva } from 'class-variance-authority';

import { cn, useThemeToken } from '../../theme';

const selectVariants = cva('rounded-md text-base bg-white dark:bg-gray-800', {
  variants: {
    variant: {
      default: 'border-gray-300 focus:border-primary-500',
      error: 'border-red-500 focus:border-red-500',
      success: 'border-green-500 focus:border-green-500',
    },
    size: {
      default: 'h-10',
      sm: 'h-8 text-xs',
      lg: 'h-12 text-lg',
    },
    fullWidth: {
      true: 'w-full',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    fullWidth: false,
  },
});

export interface SelectProps<T = any>
  extends Omit<AntSelectProps<T>, 'size'>,
    VariantProps<typeof selectVariants> {
  error?: string;
  options?: { label: React.ReactNode; value: T; disabled?: boolean }[];
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      fullWidth,
      error,
      options = [],
      ...props
    },
    ref,
  ) => {
    const token = useThemeToken();

    // Map our size variants to ant design sizes
    const getAntSelectSize = () => {
      switch (size) {
        case 'sm':
          return 'small';
        case 'lg':
          return 'large';
        default:
          return 'middle';
      }
    };

    // If there's an error message provided, switch to error variant
    const actualVariant = error ? 'error' : variant;

    return (
      <div className="space-y-1">
        <AntSelect
          ref={ref as any}
          size={getAntSelectSize()}
          status={actualVariant === 'error' ? 'error' : undefined}
          style={{
            width: fullWidth ? '100%' : undefined,
            borderRadius: token.borderRadius,
          }}
          className={cn(
            selectVariants({ variant: actualVariant, size, fullWidth }),
            className,
          )}
          options={options}
          popupMatchSelectWidth={false}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';

export default Select;
