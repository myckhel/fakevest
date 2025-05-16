import React, { ReactNode } from 'react';

import { cn } from '../../theme';

interface GlassContainerProps {
  className?: string;
  children: ReactNode;
  blurIntensity?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number; // 0-100
  bordered?: boolean;
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * GlassContainer - A general purpose container with glassy effects
 * Use this for sections that need transparent/frosted glass appearance
 */
export const GlassContainer: React.FC<GlassContainerProps> = ({
  className,
  children,
  blurIntensity = 'md',
  opacity = 80,
  bordered = true,
  rounded = true,
  padding = true,
}) => {
  const isDark = document.documentElement.classList.contains('dark');

  // Calculate blur class
  const getBlurClass = () => {
    switch (blurIntensity) {
      case 'none':
        return '';
      case 'xs':
        return 'backdrop-blur-xs';
      case 'sm':
        return 'backdrop-blur-sm';
      case 'lg':
        return 'backdrop-blur-lg';
      case 'xl':
        return 'backdrop-blur-xl';
      case 'md':
      default:
        return 'backdrop-blur-md';
    }
  };

  // Background with opacity
  const getBackgroundClass = () => {
    const opacityValue = opacity || 80;
    return isDark ? `bg-gray-900/${opacityValue}` : `bg-white/${opacityValue}`;
  };

  // Border class
  const getBorderClass = () => {
    if (!bordered) return '';

    return isDark ? 'border border-white/10' : 'border border-gray-200/50';
  };

  // Rounded class
  const getRoundedClass = () => {
    if (!rounded) return '';

    switch (rounded) {
      case 'sm':
        return 'rounded-sm';
      case 'md':
        return 'rounded-md';
      case 'lg':
        return 'rounded-lg';
      case 'xl':
        return 'rounded-xl';
      case 'full':
        return 'rounded-full';
      case true:
      default:
        return 'rounded';
    }
  };

  // Padding class
  const getPaddingClass = () => {
    if (!padding) return '';

    switch (padding) {
      case 'sm':
        return 'p-2';
      case 'md':
        return 'p-4';
      case 'lg':
        return 'p-6';
      case 'xl':
        return 'p-8';
      case true:
      default:
        return 'p-4';
    }
  };

  const containerClass = cn(
    getBlurClass(),
    getBackgroundClass(),
    getBorderClass(),
    getRoundedClass(),
    getPaddingClass(),
    'shadow-github transition-all duration-300',
    className,
  );

  return <div className={containerClass}>{children}</div>;
};

export default GlassContainer;
