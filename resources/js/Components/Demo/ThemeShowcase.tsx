import React, { useState } from 'react';
import { Divider, Typography, Space, Row, Col, Form, Tabs, TabsProps } from 'antd';
import { Button, Input, Card, Select, Switch, Modal, Avatar } from '../ui';
import { ThemeProvider, useThemeToken, themeColors } from '../../theme';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export const ThemeShowcase: React.FC = () => {
  const token = useThemeToken();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form states
  const [form] = Form.useForm();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);

  // Tab items for demonstrating various components
  const tabItems: TabsProps['items'] = [
    {
      key: 'buttons',
      label: 'Buttons',
      children: (
        <div className="py-4 space-y-6">
          <div>
            <Title level={5}>Button Variants</Title>
            <Space className="flex flex-wrap gap-2 mb-4">
              <Button>Default Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="link">Link Button</Button>
              <Button disabled>Disabled Button</Button>
            </Space>
          </div>
          
          <div>
            <Title level={5}>Button Sizes</Title>
            <Space className="flex flex-wrap gap-2 items-center">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
            </Space>
          </div>
          
          <div>
            <Title level={5}>Full Width Button</Title>
            <div className="max-w-md">
              <Button fullWidth>Full Width Button</Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'inputs',
      label: 'Inputs',
      children: (
        <div className="py-4 space-y-6">
          <div>
            <Title level={5}>Input Variants</Title>
            <div className="space-y-4 max-w-md">
              <Input placeholder="Default Input" />
              <Input 
                placeholder="Input with Error" 
                error="This is an error message" 
              />
              <Input 
                placeholder="Disabled Input" 
                disabled 
              />
            </div>
          </div>
          
          <div>
            <Title level={5}>Input Sizes</Title>
            <div className="space-y-4 max-w-md">
              <Input size="sm" placeholder="Small Input" />
              <Input placeholder="Default Input" />
              <Input size="lg" placeholder="Large Input" />
            </div>
          </div>
          
          <div>
            <Title level={5}>Input with Prefix/Suffix</Title>
            <div className="space-y-4 max-w-md">
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Username" 
              />
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
              />
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Password" 
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'selects',
      label: 'Selects',
      children: (
        <div className="py-4 space-y-6">
          <div>
            <Title level={5}>Select Variants</Title>
            <div className="space-y-4 max-w-md">
              <Select 
                placeholder="Select an option"
                options={[
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' },
                  { label: 'Option 3', value: '3' },
                ]}
              />
              
              <Select 
                placeholder="Select with Error"
                error="This is an error message"
                options={[
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' },
                  { label: 'Option 3', value: '3' },
                ]}
              />
              
              <Select 
                placeholder="Disabled Select"
                disabled
                options={[
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' },
                  { label: 'Option 3', value: '3' },
                ]}
              />
            </div>
          </div>
          
          <div>
            <Title level={5}>Select Sizes</Title>
            <div className="space-y-4 max-w-md">
              <Select 
                size="sm"
                placeholder="Small Select"
                options={[
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' },
                  { label: 'Option 3', value: '3' },
                ]}
              />
              
              <Select 
                placeholder="Default Select"
                options={[
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' },
                  { label: 'Option 3', value: '3' },
                ]}
              />
              
              <Select 
                size="lg"
                placeholder="Large Select"
                options={[
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' },
                  { label: 'Option 3', value: '3' },
                ]}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'cards',
      label: 'Cards',
      children: (
        <div className="py-4 space-y-6">
          <div>
            <Title level={5}>Card Variants</Title>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card title="Default Card">
                  <p>This is a default card with standard styling.</p>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Primary Card" variant="primary">
                  <p>This is a primary styled card.</p>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Flat Card" variant="flat">
                  <p>This is a flat card without borders or shadows.</p>
                </Card>
              </Col>
            </Row>
          </div>
          
          <div>
            <Title level={5}>Card Sizes</Title>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card title="Small Card" size="sm">
                  <p>Small card with less padding.</p>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Default Card">
                  <p>Default card with standard padding.</p>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Large Card" size="lg">
                  <p>Large card with more padding.</p>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      ),
    },
    {
      key: 'switches',
      label: 'Switches',
      children: (
        <div className="py-4 space-y-6">
          <div>
            <Title level={5}>Switch Examples</Title>
            <Space direction="vertical" size="large">
              <Switch label="Default Switch" />
              <Switch checked label="Checked Switch" />
              <Switch disabled label="Disabled Switch" />
              <Switch size="sm" label="Small Switch" />
              <Switch size="lg" label="Large Switch" />
            </Space>
          </div>
        </div>
      ),
    },
    {
      key: 'avatars',
      label: 'Avatars',
      children: (
        <div className="py-4 space-y-6">
          <div>
            <Title level={5}>Avatar Variants</Title>
            <Space size="large" wrap>
              <Avatar name="John Doe" />
              <Avatar variant="primary" name="John Doe" />
              <Avatar variant="success" name="John Doe" />
              <Avatar variant="warning" name="John Doe" />
              <Avatar variant="danger" name="John Doe" />
            </Space>
          </div>
          
          <div>
            <Title level={5}>Avatar Sizes</Title>
            <Space size="large" align="center" wrap>
              <Avatar size="xs" name="XS" />
              <Avatar size="sm" name="SM" />
              <Avatar size="default" name="DE" />
              <Avatar size="lg" name="LG" />
              <Avatar size="xl" name="XL" />
            </Space>
          </div>
          
          <div>
            <Title level={5}>Avatar with Image</Title>
            <Space size="large" wrap>
              <Avatar src="https://xsgames.co/randomusers/avatar.php?g=male&seed=1" />
              <Avatar src="https://xsgames.co/randomusers/avatar.php?g=female&seed=2" />
            </Space>
          </div>
        </div>
      ),
    }
  ];

  // Form submit handler
  const handleSubmit = () => {
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError(undefined);
      setIsModalOpen(true);
    }
  };

  return (
    <ThemeProvider darkMode={isDarkMode}>
      <Card
        title={
          <div className="flex justify-between items-center">
            <Title level={3} style={{ margin: 0 }}>Fakevest UI Theme Showcase</Title>
            <div className="flex items-center gap-2">
              <Text>Dark Mode</Text>
              <Switch checked={isDarkMode} onChange={setIsDarkMode} />
            </div>
          </div>
        }
        className="max-w-4xl mx-auto my-8"
      >
        <div className="mb-6">
          <Paragraph>
            This showcase demonstrates all the themed components available in the Fakevest UI system.
            Toggle dark mode to see how components adapt to different themes.
          </Paragraph>
        </div>

        <div className="mb-8">
          <Title level={4}>Brand Colors</Title>
          <div className="flex flex-wrap gap-4 mb-4">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div key={shade} className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-lg shadow-sm`}
                  style={{
                    backgroundColor: `var(--tw-color-primary-${shade}, ${shade === 500 ? themeColors.primary : `#3b8cb7${shade === 50 ? '10' : shade === 900 ? '90' : ''}`})`,
                  }}
                />
                <Text className="text-xs mt-1">{shade}</Text>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        <div className="mb-6">
          <Tabs defaultActiveKey="buttons" items={tabItems} />
        </div>

        <Divider />

        <div className="mb-6">
          <Title level={4}>Modal Example</Title>
          <Paragraph>
            Click the button below to open a modal dialog that uses our themed components.
          </Paragraph>
          <Space>
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          </Space>
        </div>

        <Divider />

        <div className="mb-6">
          <Title level={4}>Form Example</Title>
          <div className="max-w-md">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item label="Email Address">
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                />
              </Form.Item>
              <Form.Item label="User Type">
                <Select
                  placeholder="Select user type"
                  options={[
                    { label: 'Normal User', value: 'user' },
                    { label: 'Administrator', value: 'admin' },
                  ]}
                />
              </Form.Item>
              <Form.Item>
                <div className="flex items-center justify-between">
                  <Switch label="Remember me" />
                  <Button variant="link">Forgot password?</Button>
                </div>
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit">Submit</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Card>

      <Modal
        title="Theme Showcase Modal"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        width={500}
      >
        <div className="py-4">
          <Paragraph>
            This is a modal using our theming system. It inherits all token values from the theme configuration.
          </Paragraph>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </ThemeProvider>
  );
};

export default ThemeShowcase;