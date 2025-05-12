import React, { useEffect } from 'react';

import { Alert } from 'antd';

import { useToast } from '@/Stores';
import useUIStore from '@/Stores/uiStore';

const Toast: React.FC = () => {
  const toast = useToast();
  const { hideToast } = useUIStore();

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (toast.visible) {
      timer = setTimeout(() => {
        hideToast();
      }, 5000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [toast.visible, toast.message]);

  if (!toast.visible) {
    return null;
  }

  return (
    <div className="fixed top-5 right-5 z-50 w-80 shadow-lg">
      <Alert
        message={toast.message}
        type={toast.type || 'info'}
        showIcon
        closable
        onClose={hideToast}
      />
    </div>
  );
};

export default Toast;
