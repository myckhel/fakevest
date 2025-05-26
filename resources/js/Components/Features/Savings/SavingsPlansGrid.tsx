import React, { useEffect } from 'react';

import { Link } from '@inertiajs/react';
import { Card, Col, Row, Spin, Typography } from 'antd';

import useSavingsStore from '@/Stores/savingsStore';

const { Title, Text } = Typography;

interface SavingsPlanCardProps {
  plan: {
    id: number;
    name: string;
    description: string;
    interest_rate: number;
    // Add fallback properties based on the seeded data structure
    desc?: string;
    interest?: number;
    minDays?: number;
    breakable?: boolean;
    icon?: string;
    colors?: string[];
  };
}

const SavingsPlanCard: React.FC<SavingsPlanCardProps> = ({ plan }) => {
  // Use fallback values for missing properties
  const description = plan.desc || plan.description;
  const interest = plan.interest || plan.interest_rate;
  const minDays = plan.minDays || 0;
  const breakable = plan.breakable ?? true;
  const colors = plan.colors || ['#3b8cb7', '#2c5aa0'];

  const gradientStyle = {
    background: `linear-gradient(135deg, ${colors[0]}, ${colors[1] || colors[0]})`,
  };

  return (
    <Link href={`/savings/new?plan=${plan.id}`}>
      <Card
        className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
        style={gradientStyle}
        bordered={false}
        bodyStyle={{ padding: '20px' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <Title level={4} className="text-white m-0 font-bold">
              {plan.name}
            </Title>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">
                {plan.name === 'PiggyBank'
                  ? '🐷'
                  : plan.name === 'Vault'
                    ? '🔒'
                    : plan.name === 'Goals'
                      ? '🎯'
                      : '🏆'}
              </span>
            </div>
          </div>

          <Text className="text-white/90 text-sm mb-3 flex-1">
            {description}
          </Text>

          <div className="space-y-2">
            {interest > 0 && (
              <div className="flex justify-between items-center">
                <Text className="text-white/80 text-xs">Interest Rate:</Text>
                <Text className="text-white font-semibold">
                  Up to {interest}% p.a
                </Text>
              </div>
            )}

            <div className="flex justify-between items-center">
              <Text className="text-white/80 text-xs">Flexibility:</Text>
              <Text className="text-white font-semibold">
                {breakable ? 'Breakable' : 'Lock Period'}
              </Text>
            </div>

            {minDays > 0 && (
              <div className="flex justify-between items-center">
                <Text className="text-white/80 text-xs">Min Duration:</Text>
                <Text className="text-white font-semibold">{minDays} days</Text>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

/**
 * SavingsPlansGrid component displays available savings plans
 * Fetches its own data and handles loading states
 */
const SavingsPlansGrid: React.FC = () => {
  const { plans, isLoading, fetchPlans } = useSavingsStore();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" tip="Loading savings plans..." />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="m-0">
          Start Saving
        </Title>
        <Text type="secondary">Choose a plan that fits your goals</Text>
      </div>

      <Row gutter={[16, 16]}>
        {plans.map((plan) => (
          <Col xs={24} sm={12} md={6} key={plan.id}>
            <SavingsPlanCard plan={plan} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SavingsPlansGrid;
