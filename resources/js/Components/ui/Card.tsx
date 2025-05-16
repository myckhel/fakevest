import React from 'react';

import { Card as AntCard, CardProps as AntCardProps } from 'antd';
import { VariantProps, cva } from 'class-variance-authority';

import { cn, useThemeToken } from '../../theme';

const { Meta } = AntCard;

const cardVariants = cva('overflow-hidden text-gray-800 dark:text-gray-100', {
  variants: {
    variant: {
      default:
        'border border-gray-200 shadow-github dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm',
      primary:
        'border border-primary-100 shadow-github bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm',
      flat: 'border-none shadow-none bg-white/90 dark:bg-gray-800/90',
      glass:
        'border border-white/20 dark:border-white/10 shadow-github-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-md',
      filled:
        'border-none shadow-github-sm bg-github-canvas_subtle dark:bg-gray-900/95',
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
});

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
        ref={ref}
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
