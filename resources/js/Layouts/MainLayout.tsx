import React, { useState } from 'react';

import {
  BarChartOutlined,
  BellOutlined,
  BulbFilled,
  BulbOutlined,
  DollarOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Link } from '@inertiajs/react';
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  Dropdown,
  Layout,
  Menu,
  Space,
  Typography,
} from 'antd';

import useAuthSync from '../Hooks/useAuthSync';
import useAuthStore from '../Stores/authStore';
import useUIStore from '../Stores/uiStore';

import type { MenuProps } from 'antd';

// Import Zustand stores

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sync auth state with Inertia props
  useAuthSync();

  // Get state from stores
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const darkMode = useUIStore((state) => state.darkMode);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  // Mobile drawer state
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);

  // Access actions directly from the store
  const { logout } = useAuthStore();
  const { toggleSidebar, toggleDarkMode } = useUIStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Menu items configuration
  const menuItems = [
    {
      key: '/dashboard',
      icon: <HomeOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: '/savings',
      icon: <DollarOutlined />,
      label: <Link href="/savings">Savings</Link>,
    },
    {
      key: '/wallets',
      icon: <WalletOutlined />,
      label: <Link href="/wallets">Wallets</Link>,
    },
    {
      key: '/transactions',
      icon: <BarChartOutlined />,
      label: <Link href="/transactions">Transactions</Link>,
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: <Link href="/profile">Profile</Link>,
    },
  ];

  // User dropdown menu items
  const userMenuItems: MenuProps['items'] = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: <Link href="/profile">Profile</Link>,
    },
    {
      key: '2',
      icon: <SettingOutlined />,
      label: <Link href="/settings">Settings</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  // Helper function to get user avatar URL
  const getUserAvatarUrl = () => {
    if (!user?.avatar) return undefined;

    // Handle if avatar is an object with url property
    if (typeof user.avatar === 'object' && user.avatar !== null) {
      return user.avatar.url || user.avatar.medium || user.avatar.thumb;
    }

    // Handle if avatar is already a string
    if (typeof user.avatar === 'string') {
      return user.avatar;
    }

    return undefined;
  };

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (!user) return '';

    // Check which property exists on the user object
    if (user.fullname) return user.fullname;

    // Use type assertion for potentially undefined properties
    const userData = user as any;
    if (userData.email) return userData.email.split('@')[0];

    return 'User';
  };

  return (
    <Layout className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar for desktop */}
      <Sider
        trigger={null}
        collapsible
        collapsed={!sidebarOpen}
        collapsedWidth={80}
        width={250}
        className="hidden md:block"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: darkMode ? '#1f2937' : '#fff',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          zIndex: 999,
        }}
        theme={darkMode ? 'dark' : 'light'}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="flex items-center gap-2 px-4">
            {!sidebarOpen ? (
              <span
                className={`text-2xl font-bold ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}
              >
                F
              </span>
            ) : (
              <span
                className={`text-xl font-bold ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}
              >
                FakeVest
              </span>
            )}
          </Link>
        </div>
        <Menu
          theme={darkMode ? 'dark' : 'light'}
          mode="inline"
          defaultSelectedKeys={[window.location.pathname]}
          items={menuItems}
          className="pt-2"
        />
      </Sider>

      {/* Mobile drawer */}
      <Drawer
        title={
          <div className="flex items-center">
            <span
              className={`text-xl font-bold ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}
            >
              FakeVest
            </span>
          </div>
        }
        placement="left"
        onClose={() => setMobileDrawerVisible(false)}
        open={mobileDrawerVisible}
        width={250}
        bodyStyle={{ padding: 0 }}
        headerStyle={{
          borderBottom: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`,
          background: darkMode ? '#1f2937' : '#fff',
          color: darkMode ? '#fff' : '#000',
        }}
        className={darkMode ? 'dark' : ''}
      >
        <Menu
          theme={darkMode ? 'dark' : 'light'}
          mode="inline"
          defaultSelectedKeys={[window.location.pathname]}
          items={menuItems}
          onClick={() => setMobileDrawerVisible(false)}
        />
      </Drawer>

      {/* Main content area */}
      <Layout
        className={`md:ml-[80px] ${
          sidebarOpen ? 'md:ml-[250px]' : ''
        } transition-all duration-300`}
      >
        {/* Header */}
        <Header
          className="px-4 sm:px-6 flex items-center justify-between h-16 sticky top-0 z-10 shadow-sm"
          style={{
            background: darkMode ? '#1f2937' : '#fff',
            padding: 0,
          }}
        >
          <div className="flex items-center">
            {/* Mobile menu button */}
            <Button
              type="text"
              icon={<MenuUnfoldOutlined />}
              onClick={() => setMobileDrawerVisible(true)}
              className="md:hidden mr-4"
              style={{ color: darkMode ? '#fff' : '#000' }}
            />

            {/* Desktop sidebar toggle */}
            <Button
              type="text"
              icon={sidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
              onClick={toggleSidebar}
              className="hidden md:block ml-2"
              style={{ color: darkMode ? '#fff' : '#000' }}
            />
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3 px-4">
            {/* Dark mode toggle */}
            <Button
              type="text"
              icon={darkMode ? <BulbFilled /> : <BulbOutlined />}
              onClick={toggleDarkMode}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{ color: darkMode ? '#fff' : '#000' }}
            />

            {/* Notifications */}
            <Badge count={5} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{ color: darkMode ? '#fff' : '#000' }}
              />
            </Badge>

            {/* User menu */}
            {isAuthenticated && user ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Space className="cursor-pointer">
                  <Avatar
                    src={getUserAvatarUrl()}
                    icon={<UserOutlined />}
                    size="default"
                  />
                  <Text
                    className="hidden sm:inline"
                    style={{ color: darkMode ? '#fff' : '#000' }}
                  >
                    {getUserDisplayName()}
                  </Text>
                </Space>
              </Dropdown>
            ) : (
              <Link href="/login">
                <Button type="primary">Login</Button>
              </Link>
            )}
          </div>
        </Header>

        {/* Main content */}
        <Content
          className="m-4 p-4 sm:p-6 overflow-auto"
          style={{
            background: darkMode ? '#111827' : '#f9fafb',
            minHeight: 'calc(100vh - 64px)',
            borderRadius: '8px',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
