import React from 'react';

import { Input as AntInput, InputProps as AntInputProps } from 'antd';
import { VariantProps, cva } from 'class-variance-authority';

import { cn, useThemeToken } from '../../theme';

const inputVariants = cva(
  'flex rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
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
  },
);

export interface InputProps
  extends Omit<AntInputProps, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      fullWidth,
      error,
      ...props
    },
    ref,
  ) => {
    const token = useThemeToken();

    // Map our size variants to ant design sizes
    const getAntInputSize = () => {
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
        <AntInput
          ref={ref as any}
          size={getAntInputSize()}
          status={actualVariant === 'error' ? 'error' : undefined}
          style={{
            width: fullWidth ? '100%' : undefined,
            borderRadius: token.borderRadius,
          }}
          className={cn(
            inputVariants({ variant: actualVariant, size, fullWidth }),
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
