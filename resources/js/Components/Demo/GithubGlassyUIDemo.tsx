import React from 'react';

import {
  AlertOutlined,
  BookOutlined,
  BranchesOutlined,
  CodeOutlined,
  GithubOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Divider, Space, Tag, Typography } from 'antd';

import GlassButton from '../ui/GlassButton';
import GlassCard from '../ui/GlassCard';
import GlassContainer from '../ui/GlassContainer';

const { Title, Text, Paragraph } = Typography;

interface GithubGlassyUIDemoProps {
  className?: string;
}

/**
 * Demo component showcasing the GitHub-like UI with glassy design
 */
const GithubGlassyUIDemo: React.FC<GithubGlassyUIDemoProps> = ({
  className,
}) => {
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className={`space-y-8 mx-auto max-w-5xl ${className}`}>
      <Title level={2} className="text-center">
        GitHub-like Glassy UI Components
      </Title>

      {/* Glass Card Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Title level={4}>Glass Cards</Title>

          <GlassCard
            title="Default Glass Card"
            extra={<StarOutlined />}
            className="w-full"
            variant="default"
          >
            <Paragraph>
              This is a card with default glass styling. It has a subtle
              backdrop blur and semi-transparent background.
            </Paragraph>
            <div className="flex justify-end space-x-2">
              <GlassButton size="small" icon={<CodeOutlined />}>
                Code
              </GlassButton>
              <GlassButton
                size="small"
                variant="primary"
                icon={<StarOutlined />}
              >
                Star
              </GlassButton>
            </div>
          </GlassCard>

          <GlassCard
            title="Primary Glass Card"
            className="w-full"
            variant="primary"
          >
            <Paragraph>
              This primary variant has a light blue tint with the same glass
              effect.
            </Paragraph>
            <div className="flex justify-end">
              <GlassButton variant="ghost" size="small">
                Dismiss
              </GlassButton>
            </div>
          </GlassCard>

          <GlassCard title="Dark Glass Card" className="w-full" variant="dark">
            <Paragraph className="text-white">
              This dark variant works well for highlighting important
              information.
            </Paragraph>
            <div className="flex justify-between items-center">
              <Badge count={5} />
              <GlassButton variant="ghost" size="small">
                Actions
              </GlassButton>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <Title level={4}>Glass Containers</Title>

          <GlassContainer className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar src="https://github.com/github.png" />
                <div>
                  <Text strong>GitHub Repository</Text>
                  <div className="flex items-center space-x-1 text-xs">
                    <Text type="secondary">github/github</Text>
                    <Badge
                      count="Public"
                      color={isDark ? '#30363d' : '#f6f8fa'}
                      style={{
                        color: isDark ? '#c9d1d9' : '#24292f',
                        fontWeight: 600,
                      }}
                    />
                  </div>
                </div>
              </div>
              <GlassButton
                icon={<StarOutlined />}
                variant="default"
                size="small"
              >
                Star
              </GlassButton>
            </div>
            <Divider className="my-2" />
            <div className="flex justify-between text-sm">
              <div className="flex space-x-4">
                <div className="flex items-center space-x-1">
                  <BranchesOutlined />
                  <Text>main</Text>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOutlined />
                  <Text>2.1k</Text>
                </div>
              </div>
              <div>
                <Tag color="blue">v1.0.0</Tag>
              </div>
            </div>
          </GlassContainer>

          <GlassContainer blurIntensity="lg" opacity={90} rounded="lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <AlertOutlined style={{ color: '#d73a49' }} />
                <Text strong style={{ color: '#d73a49' }}>
                  Security Alert
                </Text>
              </div>
              <GlassButton variant="danger" size="small">
                Fix Now
              </GlassButton>
            </div>
          </GlassContainer>

          <GlassContainer>
            <Title level={5}>Glassy Buttons</Title>
            <Space wrap>
              <GlassButton variant="default">Default</GlassButton>
              <GlassButton variant="primary">Primary</GlassButton>
              <GlassButton variant="success">Success</GlassButton>
              <GlassButton variant="danger">Danger</GlassButton>
              <GlassButton variant="dark">Dark</GlassButton>
              <GlassButton variant="ghost">Ghost</GlassButton>
            </Space>
          </GlassContainer>
        </div>
      </div>

      {/* GitHub Branding Footer */}
      <div className="text-center pt-8">
        <GithubOutlined className="text-2xl mb-2" />
        <Text type="secondary" className="block">
          GitHub-inspired UI components with glassy design.
        </Text>
        <Text type="secondary" className="text-xs">
          © 2025 Fakevest
        </Text>
      </div>
    </div>
  );
};

export default GithubGlassyUIDemo;
