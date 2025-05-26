import React, { useCallback, useEffect } from 'react';

import {
  ArrowRightOutlined,
  TeamOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Link } from '@inertiajs/react';
import { Button, Card, Col, Row, Space, Typography } from 'antd';

import useSavingsStore from '@/Stores/savingsStore';

const { Title, Text } = Typography;

/**
 * SavingsChallengeSection displays savings challenge promotion
 * Based on the prototype's challenge promotion section
 */
const SavingsChallengeSection: React.FC = () => {
  const { availableChallenges, fetchAvailableChallenges } = useSavingsStore();

  const loadChallenges = useCallback(() => {
    fetchAvailableChallenges();
  }, [fetchAvailableChallenges]);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  return (
    <Card
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
      }}
      bodyStyle={{ padding: '32px' }}
    >
      <Row align="middle" justify="space-between">
        <Col xs={24} md={16}>
          <Space direction="vertical" size="small">
            <Title level={3} className="text-white m-0">
              <TrophyOutlined className="mr-2" />
              Savings Challenge
            </Title>
            <Text className="text-white/90 text-lg">
              Start a savings challenge with your friends and achieve your goals
              together
            </Text>
            <div className="flex items-center mt-3">
              <TeamOutlined className="text-white/80 mr-2" />
              <Text className="text-white/80">
                {availableChallenges.length} active challenges available
              </Text>
            </div>
          </Space>
        </Col>
        <Col xs={24} md={8} className="text-right">
          <Space direction="vertical" size="middle">
            <Link href="/challenges">
              <Button
                type="primary"
                size="large"
                className="bg-white text-purple-600 hover:bg-gray-100 border-none"
              >
                Browse Challenges
                <ArrowRightOutlined />
              </Button>
            </Link>
            <Link href="/challenges/create">
              <Button
                ghost
                size="large"
                className="text-white border-white hover:bg-white/10"
              >
                Create Challenge
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 opacity-10">
        <TrophyOutlined style={{ fontSize: '120px' }} />
      </div>
      <div className="absolute bottom-0 left-0 opacity-5">
        <TeamOutlined style={{ fontSize: '80px' }} />
      </div>
    </Card>
  );
};

export default SavingsChallengeSection;
