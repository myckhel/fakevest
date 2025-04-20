import React, { useEffect, useState } from 'react';
import { Modal as AntModal, ModalProps as AntModalProps } from 'antd';
import { cn, useThemeToken } from '../../theme';

export interface ModalProps extends Omit<AntModalProps, 'visible'> {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  className,
  contentClassName,
  children,
  ...props
}) => {
  const token = useThemeToken();
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleCancel = () => {
    setOpen(false);
    onClose();
  };

  return (
    <AntModal
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      styles={{
        mask: {
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(2px)',
        },
        content: {
          borderRadius: token.borderRadius,
          padding: token.paddingLG,
        },
      }}
      className={cn('', className)}
      maskClosable={true}
      {...props}
    >
      <div className={cn('', contentClassName)}>
        {children}
      </div>
    </AntModal>
  );
};

Modal.displayName = 'Modal';

export default Modal;