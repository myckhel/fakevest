import { useState } from 'react';

import { DollarOutlined, PieChartOutlined } from '@ant-design/icons';
import { Head, Link } from '@inertiajs/react';
import { Button, Card, Col, Row, Space, Typography } from 'antd';

// Import feature components
import QuickActions from '@/Components/Features/Dashboard/QuickActions';
import SummaryCards from '@/Components/Features/Dashboard/SummaryCards';
import DepositFundsModal from '@/Components/Features/Deposits/DepositFundsModal';
import SavingsTable from '@/Components/Features/Savings/SavingsTable';
import TransactionsList from '@/Components/Features/Transactions/TransactionsList';
import TransferMoneyModal from '@/Components/Features/Transfers/TransferMoneyModal';
import WithdrawFundsModal from '@/Components/Features/Withdrawals/WithdrawFundsModal';
import MainLayout from '@/Layouts/MainLayout';
import { useAuthUser } from '@/Stores';

const { Title, Text } = Typography;

/**
 * Dashboard page component that orchestrates the UI
 * but delegates data fetching to child components
 */
const Dashboard = () => {
  // Get user and theme data from stores
  const user = useAuthUser();

  // Local state for UI management only
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);

  // Handle money transfer and withdrawal modal visibility
  const handleOpenTransferModal = () => setIsTransferModalVisible(true);
  const handleCloseTransferModal = () => setIsTransferModalVisible(false);
  const handleOpenWithdrawModal = () => setIsWithdrawModalVisible(true);
  const handleCloseWithdrawModal = () => setIsWithdrawModalVisible(false);
  const handleOpenDepositModal = () => setIsDepositModalVisible(true);
  const handleCloseDepositModal = () => setIsDepositModalVisible(false);

  return (
    <MainLayout>
      <Head title="Dashboard" />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Financial Overview
            </Title>
            <Text type="secondary" className="mt-1">
              Welcome back, {user?.fullname || 'User'}
            </Text>
          </div>

          <Space>
            <Link href="/savings/new">
              <Button type="primary" icon={<PieChartOutlined />}>
                New Savings Goal
              </Button>
            </Link>
          </Space>
        </div>

        {/* Main Dashboard Content */}
        <div>
          {/* Summary Cards - now fetches its own data */}
          <SummaryCards
            onTransfer={handleOpenTransferModal}
            onWithdraw={handleOpenWithdrawModal}
            onDeposit={handleOpenDepositModal}
          />

          {/* Quick Actions */}
          <QuickActions
            onTransfer={handleOpenTransferModal}
            onWithdraw={handleOpenWithdrawModal}
            onDeposit={handleOpenDepositModal}
          />

          {/* Recent Activity - now fetches its own data */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} md={12}>
              <TransactionsList
                title="Recent Transactions"
                limit={5}
                type="all"
              />
            </Col>

            <Col xs={24} md={12}>
              <TransactionsList
                title="Recent Transfers"
                emptyText="No recent transfers"
                type="transfers"
              />
            </Col>
          </Row>

          {/* Savings Table - now fetches its own data */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <DollarOutlined className="text-blue-600" />
                <span>Your Savings Plans</span>
              </div>
            }
            className="shadow bg-white dark:bg-gray-800"
            bordered={false}
            extra={
              <Link href="/savings/new">
                <Button type="primary" size="small">
                  New Plan
                </Button>
              </Link>
            }
          >
            <SavingsTable limit={5} />
          </Card>
        </div>

        {/* Money Transfer Modal */}
        <TransferMoneyModal
          visible={isTransferModalVisible}
          onClose={handleCloseTransferModal}
        />

        {/* Withdrawal Modal */}
        <WithdrawFundsModal
          visible={isWithdrawModalVisible}
          onClose={handleCloseWithdrawModal}
        />

        {/* Deposit Modal */}
        <DepositFundsModal
          visible={isDepositModalVisible}
          onClose={handleCloseDepositModal}
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
