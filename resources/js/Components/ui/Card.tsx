import React from 'react';

import { Card as AntCard, CardProps as AntCardProps } from 'antd';
import { VariantProps, cva } from 'class-variance-authority';

import { cn, useThemeToken } from '../../theme';

const { Meta } = AntCard;

const cardVariants = cva(
  'overflow-hidden bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  {
    variants: {
      variant: {
        default: 'border border-gray-200 shadow-sm dark:border-gray-700',
        primary: 'border border-primary-200 shadow-sm',
        flat: 'border-none shadow-none',
      },
      size: {
        default: 'p-4',
        sm: 'p-2',
        lg: 'p-6',
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

export interface CardProps
  extends Omit<AntCardProps, 'size'>,
    VariantProps<typeof cardVariants> {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      fullWidth,
      title,
      extra,
      children,
      ...props
    },
    ref,
  ) => {
    const token = useThemeToken();

    // Map our size to Ant Design sizes
    const getPadding = () => {
      switch (size) {
        case 'sm':
          return 12;
        case 'lg':
          return 24;
        default:
          return 16;
      }
    };

    return (
      <AntCard
        ref={ref as any}
        title={title}
        extra={extra}
        style={{
          width: fullWidth ? '100%' : undefined,
          padding: getPadding(),
          borderRadius: token.borderRadius,
          // Apply variant specific styling
          borderColor: variant === 'primary' ? token.colorPrimary : undefined,
        }}
        className={cn(cardVariants({ variant, size, fullWidth }), className)}
        {...props}
      >
        {children}
      </AntCard>
    );
  },
);

Card.displayName = 'Card';

export { Meta as CardMeta };
export default Card;
