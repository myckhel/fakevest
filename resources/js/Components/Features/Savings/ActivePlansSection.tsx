import { Link } from '@inertiajs/react';
import {
  Button,
  Card,
  Col,
  Empty,
  Progress,
  Row,
  Spin,
  Typography,
} from 'antd';
import React, { useCallback, useEffect } from 'react';

import { Saving } from '@/Apis/savings';
import useSavingsStore from '@/Stores/savingsStore';
import { formatCurrency } from '@/Utils/formatters';

const { Title, Text } = Typography;

// Extended Saving interface with colors support
interface ExtendedSaving extends Omit<Saving, 'plan'> {
  plan: Saving['plan'] & {
    colors?: string[];
    icon?: string;
    interest?: number;
  };
}

interface ActivePlanCardProps {
  saving: ExtendedSaving;
}

const ActivePlanCard: React.FC<ActivePlanCardProps> = ({ saving }) => {
  const progress = saving.target ? (saving.amount / saving.target) * 100 : 0;
  const planColors = saving.plan.colors || ['#3b8cb7', '#5ba0d0'];

  return (
    <Card
      className="h-full transition-all duration-200 hover:shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${planColors[0]} 0%, ${planColors[1]} 100%)`,
        border: 'none',
      }}
    >
      <div className="text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {saving.plan.icon && (
              <img
                src={saving.plan.icon}
                alt={saving.plan.name}
                className="w-8 h-8"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
            <Title level={5} className="!text-white !mb-0">
              {saving.plan.name}
            </Title>
          </div>
          <Text className="!text-white text-xs opacity-80">
            {saving.plan.interest || saving.plan.interest_rate}% p.a.
          </Text>
        </div>

        <div className="mb-4">
          <Text className="!text-white text-xs opacity-80 block">
            Current Balance
          </Text>
          <Title level={3} className="!text-white !mb-0">
            {formatCurrency(saving.amount)}
          </Title>
        </div>

        {saving.target && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <Text className="!text-white text-xs opacity-80">
                Target: {formatCurrency(saving.target)}
              </Text>
              <Text className="!text-white text-xs opacity-80">
                {progress.toFixed(1)}%
              </Text>
            </div>
            <Progress
              percent={progress}
              showInfo={false}
              strokeColor="rgba(255, 255, 255, 0.8)"
              trailColor="rgba(255, 255, 255, 0.2)"
              size="small"
            />
          </div>
        )}

        <div className="flex justify-between items-center">
          <Text className="!text-white text-xs opacity-80">
            Created: {new Date(saving.created_at).toLocaleDateString()}
          </Text>
          {saving.maturity_date && (
            <Text className="!text-white text-xs opacity-80">
              Maturity: {new Date(saving.maturity_date).toLocaleDateString()}
            </Text>
          )}
        </div>
      </div>
    </Card>
  );
};

const ActivePlansSection: React.FC = () => {
  const { savings, isLoading, fetchSavings } = useSavingsStore();

  const loadSavings = useCallback(() => {
    fetchSavings();
  }, [fetchSavings]);

  useEffect(() => {
    loadSavings();
  }, [loadSavings]);

  const activeSavings = savings.filter(
    (saving) => saving.active !== false,
  ) as ExtendedSaving[];

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Spin size="large" />
      </div>
    );
  }

  if (activeSavings.length === 0) {
    return (
      <Card>
        <Empty
          description="No active savings plans"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Link href="/savings/create">
            <Button type="primary" size="large">
              Start Your First Savings Plan
            </Button>
          </Link>
        </Empty>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Title level={3} className="!mb-0">
          Active Savings Plans
        </Title>
        <Link href="/savings">
          <Button type="link" className="!p-0">
            View All Plans →
          </Button>
        </Link>
      </div>

      <Row gutter={[16, 16]}>
        {activeSavings.slice(0, 3).map((saving) => (
          <Col key={saving.id} xs={24} sm={12} lg={8}>
            <Link href={`/savings/${saving.id}`}>
              <ActivePlanCard saving={saving} />
            </Link>
          </Col>
        ))}
      </Row>

      {activeSavings.length > 3 && (
        <div className="text-center mt-4">
          <Link href="/savings">
            <Button type="default">
              View All {activeSavings.length} Plans
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ActivePlansSection;
