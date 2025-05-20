import React from 'react';

import {
  CreditCardOutlined,
  HistoryOutlined,
  PlusOutlined,
  SendOutlined,
  SwapOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Card, Col, Row } from 'antd';

type QuickActionsProps = {
  onTransfer: () => void;
  onWithdraw: () => void;
  onDeposit: () => void;
};

/**
 * Component for displaying quick action cards in the dashboard
 */
const QuickActions: React.FC<QuickActionsProps> = ({
  onTransfer,
  onWithdraw,
  onDeposit,
}) => {
  const actions = [
    {
      icon: <SendOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      title: 'Send Money',
      onClick: onTransfer,
    },
    {
      icon: <PlusOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      title: 'New Savings',
      href: '/savings/new',
    },
    {
      icon: <CreditCardOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      title: 'Add Funds',
      onClick: onDeposit,
    },
    {
      icon: <SwapOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
      title: 'Withdraw',
      onClick: onWithdraw,
    },
    {
      icon: <HistoryOutlined style={{ fontSize: 24, color: '#f5222d' }} />,
      title: 'History',
      href: '/transactions',
    },
    {
      icon: <UserOutlined style={{ fontSize: 24, color: '#eb2f96' }} />,
      title: 'Profile',
      href: '/profile',
    },
  ];

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <SendOutlined className="text-blue-600" />
          <span>Quick Actions</span>
        </div>
      }
      className="shadow mb-6 bg-white dark:bg-gray-800"
      bordered={false}
    >
      <Row gutter={[16, 16]}>
        {actions.map((action, index) => (
          <Col xs={12} sm={8} md={6} lg={4} key={index}>
            <Card
              hoverable
              bordered={false}
              className="text-center"
              onClick={() => {
                if (action.onClick) {
                  action.onClick();
                } else if (action.href) {
                  window.location.href = action.href;
                }
              }}
              bodyStyle={{ padding: '12px' }}
            >
              {action.icon}
              <div className="mt-2">{action.title}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default QuickActions;
