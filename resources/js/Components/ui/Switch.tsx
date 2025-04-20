import React from 'react';
import { Switch as AntSwitch, SwitchProps as AntSwitchProps } from 'antd';
import { cn, useThemeToken } from '../../theme';
import { VariantProps, cva } from 'class-variance-authority';

const switchVariants = cva('', {
  variants: {
    size: {
      default: '',
      sm: 'scale-75 origin-left',
      lg: 'scale-125 origin-left',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface SwitchProps
  extends Omit<AntSwitchProps, 'size'>,
    VariantProps<typeof switchVariants> {
  label?: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, size, label, ...props }, ref) => {
    const token = useThemeToken();

    // Map our size variants to ant design sizes
    const getAntSwitchSize = () => {
      switch (size) {
        case 'sm':
          return 'small';
        case 'lg':
          return 'default'; // Ant Design doesn't have a large switch, so we'll use the default with scale
        default:
          return 'default';
      }
    };

    return (
      <div className="flex items-center gap-2">
        <AntSwitch
          ref={ref as any}
          size={getAntSwitchSize()}
          className={cn(switchVariants({ size }), className)}
          {...props}
        />
        {label && <span className="text-sm">{label}</span>}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;