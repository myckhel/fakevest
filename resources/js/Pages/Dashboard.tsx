import { useState } from 'react';

import { PieChartOutlined } from '@ant-design/icons';
import { Head, Link } from '@inertiajs/react';
import { Button, Col, Row, Space, Typography } from 'antd';

// Import feature components
import QuickActions from '@/Components/Features/Dashboard/QuickActions';
import SummaryCards from '@/Components/Features/Dashboard/SummaryCards';
import DepositFundsModal from '@/Components/Features/Deposits/DepositFundsModal';
import ActivePlansSection from '@/Components/Features/Savings/ActivePlansSection';
import SavingsChallengeSection from '@/Components/Features/Savings/SavingsChallengeSection';
import SavingsPlansGrid from '@/Components/Features/Savings/SavingsPlansGrid';
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
              Welcome back, {user?.fullname || 'User'}!
            </Title>
            <Text type="secondary" className="mt-1">
              Track your savings progress and grow your wealth with Fakevest
            </Text>
          </div>

          <Space>
            <Link href="/savings/new">
              <Button type="primary" icon={<PieChartOutlined />}>
                Start Saving
              </Button>
            </Link>
          </Space>
        </div>

        {/* Main Dashboard Content */}
        <div className="space-y-8">
          {/* Summary Cards - now fetches its own data */}
          <SummaryCards
            onTransfer={handleOpenTransferModal}
            onWithdraw={handleOpenWithdrawModal}
            onDeposit={handleOpenDepositModal}
          />

          {/* Active Plans Section */}
          <ActivePlansSection />

          {/* Savings Plans Grid - Start Saving Section */}
          <SavingsPlansGrid />

          {/* Quick Actions */}
          <QuickActions
            onTransfer={handleOpenTransferModal}
            onWithdraw={handleOpenWithdrawModal}
            onDeposit={handleOpenDepositModal}
          />

          {/* Recent Activity */}
          <Row gutter={[16, 16]} className="mb-8">
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

          {/* Savings Challenge Section */}
          <SavingsChallengeSection />
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
