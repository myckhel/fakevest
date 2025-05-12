import React from 'react';

import { LogoutOutlined } from '@ant-design/icons';
import { router } from '@inertiajs/react';
import { Button, ButtonProps } from 'antd';

interface LogoutButtonProps extends Omit<ButtonProps, 'onClick'> {
  variant?: 'button' | 'link' | 'menu-item';
  children?: React.ReactNode;
}

/**
 * A logout button component that uses Inertia.js to handle the logout process
 *
 * @param variant - The visual variant of the logout button ("button", "link", "menu-item")
 * @param props - Other button props from AntD Button
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'button',
  children,
  ...props
}) => {
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use the router to visit the logout route
    router.visit('/logout', { method: 'get', preserveScroll: false });
  };

  if (variant === 'link') {
    return (
      <a href="#" onClick={handleLogout} className="flex items-center">
        <LogoutOutlined className="mr-2" />
        {children || 'Logout'}
      </a>
    );
  }

  if (variant === 'menu-item') {
    return (
      <div
        onClick={handleLogout}
        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
      >
        <LogoutOutlined className="mr-2" />
        {children || 'Logout'}
      </div>
    );
  }

  // Default button variant
  return (
    <Button
      type="default"
      icon={<LogoutOutlined />}
      onClick={handleLogout}
      {...props}
    >
      {children || 'Logout'}
    </Button>
  );
};

export default LogoutButton;
