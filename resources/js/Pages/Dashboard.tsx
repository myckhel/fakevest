import React, { useState } from "react";
import { useAuthUser, useDarkMode } from "@/Stores";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link } from "@inertiajs/react";
import { Card, Typography, Button, Space, Tabs, Row, Col } from "antd";
import { PieChartOutlined, DollarOutlined } from "@ant-design/icons";

// Import feature components
import SummaryCards from "@/Components/Features/Dashboard/SummaryCards";
import QuickActions from "@/Components/Features/Dashboard/QuickActions";
import SavingsTable from "@/Components/Features/Savings/SavingsTable";
import TransactionsList from "@/Components/Features/Transactions/TransactionsList";
import TransferMoneyModal from "@/Components/Features/Transfers/TransferMoneyModal";
import WithdrawFundsModal from "@/Components/Features/Withdrawals/WithdrawFundsModal";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

/**
 * Dashboard page component that orchestrates the UI
 * but delegates data fetching to child components
 */
const Dashboard = () => {
  // Get user and theme data from stores
  const user = useAuthUser();
  const darkMode = useDarkMode();

  // Local state for UI management only
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState("overview");

  // Handle money transfer and withdrawal modal visibility
  const handleOpenTransferModal = () => setIsTransferModalVisible(true);
  const handleCloseTransferModal = () => setIsTransferModalVisible(false);
  const handleOpenWithdrawModal = () => setIsWithdrawModalVisible(true);
  const handleCloseWithdrawModal = () => setIsWithdrawModalVisible(false);

  // Overview tab content
  const renderOverviewTab = () => (
    <>
      {/* Summary Cards - now fetches its own data */}
      <SummaryCards
        onTransfer={handleOpenTransferModal}
        onWithdraw={handleOpenWithdrawModal}
      />

      {/* Quick Actions */}
      <QuickActions
        onTransfer={handleOpenTransferModal}
        onWithdraw={handleOpenWithdrawModal}
      />

      {/* Recent Activity - now fetches its own data */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={12}>
          <TransactionsList title="Recent Transactions" limit={5} type="all" />
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
    </>
  );

  // Transactions tab content
  const renderTransactionsTab = () => (
    <Card className="shadow bg-white dark:bg-gray-800" bordered={false}>
      <Tabs defaultActiveKey="all">
        <TabPane tab="All Transactions" key="all">
          <TransactionsList showViewAll={false} limit={10} />
        </TabPane>
        <TabPane tab="Deposits" key="deposits">
          <TransactionsList showViewAll={false} limit={10} type="deposits" />
        </TabPane>
        <TabPane tab="Withdrawals" key="withdrawals">
          <TransactionsList showViewAll={false} limit={10} type="withdrawals" />
        </TabPane>
      </Tabs>
    </Card>
  );

  // Wallets tab content - using components that handle their own data fetching
  const renderWalletsTab = () => (
    <>
      {/* Wallet content is rendered in its own tab */}
      <Card className="shadow bg-white dark:bg-gray-800" bordered={false}>
        <Tabs defaultActiveKey="naira">
          <TabPane tab="Naira Wallet" key="naira">
            {/* We could create a WalletDetails component that fetches its own data */}
            <div className="py-4">
              <TransactionsList
                title="Naira Wallet Transactions"
                showViewAll={false}
                limit={10}
                type="naira"
              />
            </div>
          </TabPane>
          <TabPane tab="Dollar Wallet" key="dollar">
            <div className="py-4">
              <TransactionsList
                title="Dollar Wallet Transactions"
                showViewAll={false}
                limit={10}
                type="dollar"
              />
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </>
  );

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
              Welcome back, {user?.fullname || "User"}
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

        {/* Main Navigation Tabs */}
        <Card
          bordered={false}
          className="shadow-sm mb-6 bg-white dark:bg-gray-800"
          bodyStyle={{ padding: 0 }}
        >
          <Tabs
            activeKey={activeTabKey}
            onChange={setActiveTabKey}
            size="large"
            type="card"
            tabBarStyle={{ marginBottom: 0, padding: "0 16px" }}
          >
            <TabPane tab="Overview" key="overview" />
            <TabPane tab="Transactions" key="transactions" />
            <TabPane tab="Wallets" key="wallets" />
          </Tabs>
        </Card>

        {/* Render tab content based on active tab */}
        {activeTabKey === "overview" && renderOverviewTab()}
        {activeTabKey === "transactions" && renderTransactionsTab()}
        {activeTabKey === "wallets" && renderWalletsTab()}

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
      </div>
    </MainLayout>
  );
};

export default Dashboard;
