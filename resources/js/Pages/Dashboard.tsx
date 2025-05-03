import React, { useEffect, useState } from "react";
import {
  useAuthUser,
  usePortfolio,
  useSavingsList,
  useSavingsLoading,
  useDarkMode,
} from "@/Stores";
import useSavingsStore from "@/Stores/savingsStore";
import useUIStore from "@/Stores/uiStore";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link } from "@inertiajs/react";
import {
  Card,
  Spin,
  Progress,
  Statistic,
  Badge,
  Empty,
  Tabs,
  Typography,
  Button,
  Row,
  Col,
  Tag,
  Divider,
  Table,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  WalletOutlined,
  LineChartOutlined,
  BankOutlined,
  CalendarOutlined,
  DollarOutlined,
  PieChartOutlined,
  HistoryOutlined,
  RiseOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const Dashboard = () => {
  // Access state from individual selectors to prevent unnecessary re-renders
  const user = useAuthUser();
  const portfolio = usePortfolio();
  const savings = useSavingsList();
  const isLoading = useSavingsLoading();
  const darkMode = useDarkMode();

  // Access actions directly from store
  const { fetchPlans, fetchSavings, fetchPortfolio } = useSavingsStore();
  const { showToast } = useUIStore();

  // Local state for chart data
  const [chartData, setChartData] = useState<number[]>([]);

  // Initialize data when component mounts
  useEffect(() => {
    const initData = async () => {
      try {
        // Fetch plans, savings, and portfolio data in parallel
        await Promise.all([fetchPlans(), fetchSavings(), fetchPortfolio()]);
      } catch (error) {
        console.error("Error initializing dashboard data:", error);
        showToast("Failed to load dashboard data. Please try again.", "error");
      }
    };

    initData();
  }, []); // Empty dependency array means this runs once on mount

  // Update chart data when portfolio changes
  useEffect(() => {
    if (portfolio?.chart) {
      setChartData(portfolio.chart.slice(0, 7));
    }
  }, [portfolio]);

  // Calculate percentage of monthly savings compared to lifetime
  const calculateMonthlyPercentage = () => {
    if (!portfolio || portfolio.lifetime === 0) return 0;
    return Math.min(
      100,
      Math.round((portfolio.thisMonth / portfolio.lifetime) * 100)
    );
  };

  // Calculate percentage of weekly savings compared to monthly
  const calculateWeeklyPercentage = () => {
    if (!portfolio || portfolio.thisMonth === 0) return 0;
    return Math.min(
      100,
      Math.round((portfolio.thisWeek / portfolio.thisMonth) * 100)
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get status indicator for savings
  const getSavingStatus = (saving) => {
    const now = new Date();
    const maturityDate = new Date(saving.maturity_date);

    // If maturity date is within 7 days, return warning
    if (maturityDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return "warning";
    }

    // If wallet balance meets or exceeds target, return success
    if (saving.wallet?.balance >= saving.target) {
      return "success";
    }

    return "processing";
  };

  // Get days remaining until maturity date
  const getDaysRemaining = (maturityDateString: string) => {
    const now = new Date();
    const maturityDate = new Date(maturityDateString);
    const diffTime = Math.abs(maturityDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Table columns for savings
  const columns = [
    {
      title: "Description",
      dataIndex: "desc",
      key: "desc",
      render: (text, record) => (
        <Link href={`/savings/${record.id}`}>
          <Text className="font-medium">{text}</Text>
        </Link>
      ),
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
      render: (plan) => plan?.name,
    },
    {
      title: "Target",
      dataIndex: "target",
      key: "target",
      render: (amount) => formatCurrency(amount),
    },
    {
      title: "Balance",
      dataIndex: "wallet",
      key: "balance",
      render: (wallet) => formatCurrency(wallet?.balance || 0),
    },
    {
      title: "Progress",
      key: "progress",
      render: (_, record) => (
        <Progress
          percent={Math.round(
            ((record.wallet?.balance || 0) / record.target) * 100
          )}
          size="small"
          status={
            (record.wallet?.balance || 0) >= record.target
              ? "success"
              : "active"
          }
        />
      ),
    },
    {
      title: "Maturity",
      dataIndex: "maturity_date",
      key: "maturity_date",
      render: (date) => (
        <span>
          {formatDate(date)}
          <div className="text-xs text-gray-500">
            {getDaysRemaining(date)} days left
          </div>
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Badge
          status={getSavingStatus(record)}
          text={record.status.charAt(0).toUpperCase() + record.status.slice(1)}
        />
      ),
    },
  ];

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

          <Link href="/savings/new">
            <Button type="primary" icon={<PieChartOutlined />}>
              New Savings Goal
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" tip="Loading your financial data..." />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            {portfolio && (
              <Row gutter={[16, 16]} className="mb-6">
                {/* Total Savings Card */}
                <Col xs={24} sm={12} md={6}>
                  <Card
                    className={`h-full shadow ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                    bordered={false}
                  >
                    <Statistic
                      title={
                        <div className="flex items-center gap-2 text-base font-medium">
                          <BankOutlined className="text-blue-600" /> Total
                          Savings
                        </div>
                      }
                      value={portfolio.lifetime}
                      precision={2}
                      valueStyle={{ color: "#3b8cb7", fontSize: "1.5rem" }}
                      prefix="₦"
                      formatter={(value) => value.toLocaleString()}
                    />
                    <div className="mt-2">
                      <span
                        className={
                          portfolio.balance_change >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {portfolio.balance_change >= 0 ? (
                          <ArrowUpOutlined />
                        ) : (
                          <ArrowDownOutlined />
                        )}
                        {Math.abs(
                          portfolio.balance_change_percentage || 0
                        ).toFixed(2)}
                        %
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2 text-xs">
                        vs. last period
                      </span>
                    </div>
                  </Card>
                </Col>

                {/* Wallet Balance */}
                <Col xs={24} sm={12} md={6}>
                  <Card
                    className={`h-full shadow ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                    bordered={false}
                  >
                    <Statistic
                      title={
                        <div className="flex items-center gap-2 text-base font-medium">
                          <WalletOutlined className="text-green-600" /> Wallet
                          Balance
                        </div>
                      }
                      value={portfolio.net.wallet}
                      precision={2}
                      valueStyle={{ color: "#52c41a", fontSize: "1.5rem" }}
                      prefix="₦"
                      formatter={(value) => value.toLocaleString()}
                    />
                    <div className="mt-2">
                      <Progress
                        percent={Math.round(portfolio.net.wallet)}
                        size="small"
                        status="active"
                        strokeColor="#52c41a"
                      />
                    </div>
                  </Card>
                </Col>

                {/* Monthly Savings */}
                <Col xs={24} sm={12} md={6}>
                  <Card
                    className={`h-full shadow ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                    bordered={false}
                  >
                    <Statistic
                      title={
                        <div className="flex items-center gap-2 text-base font-medium">
                          <CalendarOutlined className="text-purple-600" />{" "}
                          Monthly Savings
                        </div>
                      }
                      value={portfolio.thisMonth}
                      precision={2}
                      valueStyle={{ color: "#722ed1", fontSize: "1.5rem" }}
                      prefix="₦"
                      formatter={(value) => value.toLocaleString()}
                    />
                    <div className="mt-2">
                      <Progress
                        percent={calculateMonthlyPercentage()}
                        size="small"
                        strokeColor="#722ed1"
                        status="active"
                      />
                    </div>
                  </Card>
                </Col>

                {/* Weekly Activity */}
                <Col xs={24} sm={12} md={6}>
                  <Card
                    className={`h-full shadow ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                    bordered={false}
                  >
                    <Statistic
                      title={
                        <div className="flex items-center gap-2 text-base font-medium">
                          <LineChartOutlined className="text-orange-500" />{" "}
                          Weekly Activity
                        </div>
                      }
                      value={portfolio.thisWeek}
                      precision={2}
                      valueStyle={{ color: "#fa8c16", fontSize: "1.5rem" }}
                      prefix="₦"
                      formatter={(value) => value.toLocaleString()}
                    />

                    <div className="mt-4 flex justify-between items-end h-10">
                      {chartData.map((value, index) => (
                        <div
                          key={index}
                          className="rounded-t"
                          style={{
                            height: `${Math.max(
                              10,
                              (value / Math.max(...chartData, 1)) * 40
                            )}px`,
                            width: "8px",
                            backgroundColor: darkMode ? "#d87a16" : "#ffd591",
                          }}
                        />
                      ))}
                    </div>
                  </Card>
                </Col>
              </Row>
            )}

            {/* Distribution Cards */}
            {portfolio && (
              <Row gutter={[16, 16]} className="mb-6">
                {/* Financial Distribution */}
                <Col xs={24} md={12}>
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <PieChartOutlined className="text-blue-600" />
                        <span>Portfolio Distribution</span>
                      </div>
                    }
                    className={`shadow ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                    bordered={false}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <Text>Savings</Text>
                        <div className="text-xl font-medium">
                          {portfolio.net.savings.toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <Text>Wallet</Text>
                        <div className="text-xl font-medium">
                          {portfolio.net.wallet.toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <Text>Interest</Text>
                        <div className="text-xl font-medium">
                          {((portfolio.net.savings || 0) * 0.05).toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Progress
                        percent={portfolio.net.savings}
                        success={{
                          percent: (portfolio.net.savings || 0) * 0.05,
                        }}
                        strokeColor="#3b8cb7"
                        trailColor="#52c41a50"
                      />
                    </div>

                    <div className="mt-2 flex gap-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#3b8cb7] rounded-full mr-1"></div>
                        <span className="text-xs">Savings</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#52c41a50] rounded-full mr-1"></div>
                        <span className="text-xs">Wallet</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#52c41a] rounded-full mr-1"></div>
                        <span className="text-xs">Interest</span>
                      </div>
                    </div>
                  </Card>
                </Col>

                {/* Period Comparison */}
                <Col xs={24} md={12}>
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <HistoryOutlined className="text-blue-600" />
                        <span>Period Comparison</span>
                      </div>
                    }
                    className={`shadow ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                    bordered={false}
                  >
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Text className="text-xs text-gray-500">This Week</Text>
                        <div className="text-lg font-medium mt-1">
                          {formatCurrency(portfolio.thisWeek)}
                        </div>
                        <Progress
                          percent={calculateWeeklyPercentage()}
                          size="small"
                          showInfo={false}
                          strokeColor="#3b8cb7"
                        />
                      </div>

                      <div>
                        <Text className="text-xs text-gray-500">
                          This Month
                        </Text>
                        <div className="text-lg font-medium mt-1">
                          {formatCurrency(portfolio.thisMonth)}
                        </div>
                        <Progress
                          percent={calculateMonthlyPercentage()}
                          size="small"
                          showInfo={false}
                          strokeColor="#3b8cb7"
                        />
                      </div>

                      <div>
                        <Text className="text-xs text-gray-500">This Year</Text>
                        <div className="text-lg font-medium mt-1">
                          {formatCurrency(portfolio.thisYear)}
                        </div>
                        <Progress
                          percent={100}
                          size="small"
                          showInfo={false}
                          strokeColor="#3b8cb7"
                        />
                      </div>
                    </div>

                    <Divider className="my-4" />

                    <div className="flex justify-between items-center">
                      <div>
                        <Text className="text-xs text-gray-500">
                          Overall Growth
                        </Text>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-medium">
                            {portfolio.balance_change >= 0 ? "+" : ""}
                            {portfolio.balance_change_percentage?.toFixed(2)}%
                          </span>
                          {portfolio.balance_change >= 0 ? (
                            <RiseOutlined className="text-green-500" />
                          ) : (
                            <ArrowDownOutlined className="text-red-500" />
                          )}
                        </div>
                      </div>

                      <Tag
                        color={
                          portfolio.balance_change >= 0 ? "success" : "error"
                        }
                        className="text-sm"
                      >
                        {portfolio.balance_change >= 0
                          ? "Positive Growth"
                          : "Needs Attention"}
                      </Tag>
                    </div>
                  </Card>
                </Col>
              </Row>
            )}

            {/* Savings Table */}
            <Card
              title={
                <div className="flex items-center gap-2">
                  <DollarOutlined className="text-blue-600" />
                  <span>Your Savings Plans</span>
                </div>
              }
              className={`shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}
              bordered={false}
              extra={
                <Link href="/savings/new">
                  <Button type="primary" size="small">
                    New Plan
                  </Button>
                </Link>
              }
            >
              {savings.length === 0 ? (
                <Empty
                  description={
                    <div>
                      <p className="mb-4">No savings plans found</p>
                      <p className="text-sm text-gray-500">
                        Start by creating your first savings goal to track your
                        progress
                      </p>
                    </div>
                  }
                >
                  <Link href="/savings/new">
                    <Button type="primary">Create First Savings Plan</Button>
                  </Link>
                </Empty>
              ) : (
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Active Plans" key="1">
                    <div className="overflow-x-auto">
                      <Table
                        dataSource={savings}
                        columns={columns}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                        className="mt-3"
                        onRow={(record) => ({
                          onClick: () => {
                            window.location.href = `/savings/${record.id}`;
                          },
                          style: { cursor: "pointer" },
                        })}
                      />
                    </div>
                  </TabPane>
                  <TabPane tab="Analytics" key="2">
                    <div className="p-6 text-center">
                      <img
                        src="/assets/analytics-placeholder.svg"
                        alt="Analytics Placeholder"
                        className="max-w-xs mx-auto mb-4 opacity-60"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <Text>Detailed analytics coming soon</Text>
                      <Paragraph className="text-gray-500 text-sm mt-2">
                        We're working on advanced analytics to help you
                        visualize your savings journey
                      </Paragraph>
                    </div>
                  </TabPane>
                </Tabs>
              )}
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
