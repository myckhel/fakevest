import React from 'react';

import { Card as AntCard, CardProps as AntCardProps } from 'antd';
import { cn, useThemeToken } from '../../theme';

const { Meta } = AntCard;

interface GlassCardProps extends Omit<AntCardProps, 'className'> {
  className?: string;
  blurIntensity?: 'none' | 'sm' | 'md' | 'lg';
  opacity?: number; // 0-100
  variant?: 'default' | 'primary' | 'dark' | 'filled';
  bordered?: boolean;
  children: React.ReactNode;
}

/**
 * GlassCard component with GitHub-like styling and glassmorphism effects
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  className,
  blurIntensity = 'md',
  opacity = 85,
  variant = 'default',
  bordered = true,
  title,
  extra,
  children,
  ...props
}) => {
  const token = useThemeToken();
  const isDark = document.documentElement.classList.contains('dark');

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

  // Calculate background color based on variant and opacity
  const getBgClass = () => {
    const opacityValue = opacity || 85;

    switch (variant) {
      case 'primary':
        return isDark
          ? `bg-primary-900/${opacityValue} text-white`
          : `bg-primary-50/${opacityValue} text-gray-900`;
      case 'dark':
        return `bg-gray-900/${opacityValue} text-white`;
      case 'filled':
        return isDark
          ? 'bg-github-canvas_subtle text-github-neutral-emphasis'
          : 'bg-github-canvas_subtle text-github-neutral-emphasis';
      case 'default':
      default:
        return isDark
          ? `bg-gray-800/${opacityValue} text-gray-100`
          : `bg-white/${opacityValue} text-gray-900`;
    }
  };

  // Calculate border class
  const getBorderClass = () => {
    if (!bordered) return 'border-0';

    switch (variant) {
      case 'primary':
        return isDark
          ? 'border border-primary-700/50'
          : 'border border-primary-100';
      case 'dark':
        return 'border border-gray-700/50';
      case 'filled':
        return 'border border-github-border_default';
      case 'default':
      default:
        return isDark ? 'border border-white/10' : 'border border-gray-200/70';
    }
  };

  // Calculate shadow class
  const getShadowClass = () => {
    switch (variant) {
      case 'primary':
        return 'shadow-github-md';
      case 'dark':
        return 'shadow-github-lg';
      case 'filled':
        return 'shadow-github-sm';
      case 'default':
      default:
        return 'shadow-github';
    }
  };

  const composedClassName = cn(
    getBlurClass(),
    getBgClass(),
    getBorderClass(),
    getShadowClass(),
    'overflow-hidden transition-all duration-200',
    className,
  );

  return (
    <AntCard
      bordered={false} // We handle borders through custom classes
      title={title}
      extra={extra}
      className={composedClassName}
      style={{
        borderRadius: token.borderRadius,
      }}
      {...props}
    >
      {children}
    </AntCard>
  );
};

export { Meta as GlassCardMeta };
export default GlassCard;
