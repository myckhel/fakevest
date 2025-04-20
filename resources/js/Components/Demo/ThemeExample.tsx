import React, { useState } from 'react';
import { Card, Space, Typography, Divider, Switch } from 'antd';
import { Button, Input } from '../ui';
import { ThemeProvider, useThemeToken, themeColors } from '../../theme';

const { Title, Text } = Typography;

export const ThemeExample: React.FC = () => {
  const token = useThemeToken();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError(undefined);
      alert(`Form submitted with email: ${email}`);
    }
  };
  
  return (
    <ThemeProvider darkMode={isDarkMode}>
      <Card 
        title={
          <div className="flex justify-between items-center">
            <Title level={4} style={{ margin: 0 }}>Fakevest Theme Example</Title>
            <Space>
              <Text>Dark Mode</Text>
              <Switch 
                checked={isDarkMode}
                onChange={(checked) => setIsDarkMode(checked)}
              />
            </Space>
          </div>
        }
        className="max-w-xl mx-auto my-10 shadow-md"
      >
        <div className="mb-6">
          <Title level={5}>Brand Colors</Title>
          <div className="flex flex-wrap gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div 
                key={shade} 
                className="flex flex-col items-center"
              >
                <div 
                  className="w-12 h-12 rounded"
                  style={{ 
                    backgroundColor: `var(--tw-color-primary-${shade}, ${shade === 500 ? themeColors.primary : `rgb(var(--primary-${shade}))`})`
                  }}
                />
                <Text className="text-xs mt-1">{shade}</Text>
              </div>
            ))}
          </div>
        </div>
        
        <Divider />
        
        <div className="mb-6">
          <Title level={5}>Buttons</Title>
          <Space className="flex flex-wrap mb-4">
            <Button>Default Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="link">Link Button</Button>
          </Space>
          <Space className="flex flex-wrap">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </Space>
        </div>
        
        <Divider />
        
        <div className="mb-6">
          <Title level={5}>Form Demo</Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                fullWidth
              />
            </div>
            <div className="flex justify-end">
              <Button htmlType="submit">Submit</Button>
            </div>
          </form>
        </div>
      </Card>
    </ThemeProvider>
  );
};

export default ThemeExample;