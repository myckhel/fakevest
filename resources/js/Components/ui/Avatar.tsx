import React from 'react';
import { Avatar as AntAvatar, AvatarProps as AntAvatarProps } from 'antd';
import { cn, useThemeToken } from '../../theme';
import { VariantProps, cva } from 'class-variance-authority';

const avatarVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-gray-200 text-gray-600',
      primary: 'bg-primary-100 text-primary-700',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700',
      danger: 'bg-red-100 text-red-700',
    },
    size: {
      default: 'w-10 h-10',
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface AvatarProps
  extends Omit<AntAvatarProps, 'size'>,
    VariantProps<typeof avatarVariants> {
  name?: string;
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, variant = 'default', size = 'default', src, name, ...props }, ref) => {
    const token = useThemeToken();
    
    // Get initials from name (if provided)
    const getInitials = () => {
      if (!name) return '';
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    };

    // Map our size variants to pixel values for AntD
    const getAntAvatarSize = () => {
      switch (size) {
        case 'xs':
          return 24;
        case 'sm':
          return 32;
        case 'default':
          return 40;
        case 'lg':
          return 48;
        case 'xl':
          return 64;
        default:
          return 40;
      }
    };

    const getBackgroundColor = () => {
      switch (variant) {
        case 'primary':
          return token.colorPrimary + '20'; // 20 is hex for 12% opacity
        case 'success':
          return token.colorSuccess + '20';
        case 'warning':
          return token.colorWarning + '20';
        case 'danger':
          return token.colorError + '20';
        default:
          return '#f0f0f0';
      }
    };

    const getTextColor = () => {
      switch (variant) {
        case 'primary':
          return token.colorPrimary;
        case 'success':
          return token.colorSuccess;
        case 'warning':
          return token.colorWarning;
        case 'danger':
          return token.colorError;
        default:
          return token.colorTextSecondary;
      }
    };

    return (
      <AntAvatar
        ref={ref as any}
        size={getAntAvatarSize()}
        src={src}
        style={{
          backgroundColor: !src ? getBackgroundColor() : undefined,
          color: !src ? getTextColor() : undefined,
        }}
        className={cn(avatarVariants({ variant, size }), className)}
        {...props}
      >
        {!src && getInitials()}
      </AntAvatar>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;