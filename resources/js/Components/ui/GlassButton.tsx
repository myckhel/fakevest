import React from 'react';

import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';
import { cn } from '../../theme';

interface GlassButtonProps extends AntButtonProps {
  blurIntensity?: 'none' | 'sm' | 'md' | 'lg';
  opacity?: number; // 0-100
  variant?: 'default' | 'primary' | 'dark' | 'ghost' | 'danger' | 'success';
}

/**
 * GlassButton component with GitHub-like styling and glassmorphism effects
 */
export const GlassButton: React.FC<GlassButtonProps> = ({
  className,
  blurIntensity = 'sm',
  opacity = 90,
  variant = 'default',
  type,
  children,
  ...props
}) => {
  const isDark = document.documentElement.classList.contains('dark');

  // Get the appropriate button type based on variant
  const getButtonType = (): AntButtonProps['type'] => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'danger':
        return 'dashed';
      case 'success':
        return 'primary'; // We'll override the color with classes
      case 'ghost':
        return 'text';
      default:
        return type || 'default';
    }
  };

  // Calculate blur class based on intensity
  const getBlurClass = () => {
    switch (blurIntensity) {
      case 'none':
        return '';
      case 'sm':
        return 'backdrop-blur-sm';
      case 'lg':
        return 'backdrop-blur-lg';
      case 'md':
      default:
        return 'backdrop-blur-md';
    }
  };

  // Calculate background and text color based on variant
  const getStyleClasses = () => {
    const opacityValue = opacity || 90;

    // Don't apply glass effect to disabled buttons
    if (props.disabled) {
      return isDark
        ? 'bg-gray-800/40 text-gray-400 border-gray-700/50'
        : 'bg-gray-100/80 text-gray-400 border-gray-200/50';
    }

    switch (variant) {
      case 'primary':
        return isDark
          ? `bg-primary-600/${opacityValue} hover:bg-primary-500/${opacityValue} active:bg-primary-700/${opacityValue} text-white border-primary-400/30`
          : `bg-primary-500/${opacityValue} hover:bg-primary-600/${opacityValue} active:bg-primary-700/${opacityValue} text-white border-primary-400/20`;
      case 'danger':
        return isDark
          ? `bg-github-danger-emphasis/${opacityValue} hover:bg-github-danger-fg/${opacityValue} text-white border-github-danger-emphasis/30`
          : `bg-github-danger-emphasis/${opacityValue} hover:bg-github-danger-fg/${opacityValue} text-white border-github-danger-emphasis/20`;
      case 'success':
        return isDark
          ? `bg-github-success-emphasis/${opacityValue} hover:bg-github-success-fg/${opacityValue} text-white border-github-success-emphasis/30`
          : `bg-github-success-emphasis/${opacityValue} hover:bg-github-success-fg/${opacityValue} text-white border-github-success-emphasis/20`;
      case 'dark':
        return isDark
          ? `bg-gray-800/${opacityValue} hover:bg-gray-700/${opacityValue} text-white border-gray-600/50`
          : `bg-gray-900/${opacityValue} hover:bg-gray-800/${opacityValue} text-white border-gray-700/30`;
      case 'ghost':
        return isDark
          ? 'bg-transparent hover:bg-gray-800/50 text-gray-300 border-transparent'
          : 'bg-transparent hover:bg-gray-100/80 text-gray-800 border-transparent';
      case 'default':
      default:
        return isDark
          ? `bg-gray-700/${opacityValue} hover:bg-gray-600/${opacityValue} text-gray-100 border-gray-600/50`
          : `bg-white/${opacityValue} hover:bg-gray-50/${opacityValue} text-gray-800 border-gray-200/70`;
    }
  };

  const composedClassName = cn(
    getBlurClass(),
    getStyleClasses(),
    'transition-all duration-200 shadow-github-sm hover:shadow-github',
    className,
  );

  return (
    <AntButton type={getButtonType()} className={composedClassName} {...props}>
      {children}
    </AntButton>
  );
};

export default GlassButton;
