import React from 'react';

import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';
import { VariantProps, cva } from 'class-variance-authority';

import { cn, useThemeToken } from '../../theme';

// Define button variants using class-variance-authority (cva)
// This approach is inspired by shadcn-ui pattern for component styling
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        // Using tailwind classes for additional styling that complements AntD
        default: 'bg-primary hover:bg-primary-600 text-white',
        outline: 'border border-primary hover:bg-primary-50 text-primary',
        ghost: 'hover:bg-primary-50 text-primary',
        link: 'text-primary underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 p-0',
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

// Extend AntD button props with our custom variants
export interface ButtonProps
  extends AntButtonProps,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

// Create our Button component that combines AntD Button with our styling system
export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'default',
  size = 'default',
  fullWidth,
  children,
  ...props
}) => {
  // Access theme tokens to ensure consistency with our design system
  const token = useThemeToken();

  // Map our variants to AntD button types
  const getAntButtonType = () => {
    switch (variant) {
      case 'default':
        return 'primary';
      case 'outline':
        return 'default';
      case 'ghost':
        return 'text';
      case 'link':
        return 'link';
      default:
        return 'primary';
    }
  };

  // Map our sizes to AntD button sizes
  const getAntButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'small';
      case 'lg':
        return 'large';
      default:
        return 'middle';
    }
  };

  return (
    <AntButton
      type={getAntButtonType()}
      size={getAntButtonSize()}
      block={fullWidth}
      style={{
        // Apply any custom styles needed for perfect alignment with our design system
        borderRadius: token.borderRadius,
      }}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      {children}
    </AntButton>
  );
};

export default Button;
