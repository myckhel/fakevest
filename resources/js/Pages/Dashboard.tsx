import React, { useEffect, useState } from "react";
import {
  useAuthUser,
  usePortfolio,
  useSavingsList,
  useSavingsLoading,
  useDarkMode,
  useNairaWallet,
  useDollarWallet,
  useRecentTransactions,
  useTransfers,
  useWalletLoading,
  useTransactionLoading,
} from "@/Stores";
import useSavingsStore from "@/Stores/savingsStore";
import useUIStore from "@/Stores/uiStore";
import useWalletStore from "@/Stores/walletStore";
import useTransactionStore from "@/Stores/transactionStore";
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
  Avatar,
  List,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Select,
  Alert,
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
  SendOutlined,
  SwapOutlined,
  PlusOutlined,
  ReloadOutlined,
  CreditCardOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const Dashboard = () => {
  const user = useAuthUser();
  const portfolio = usePortfolio();
  const savings = useSavingsList();
  const nairaWallet = useNairaWallet();
  const dollarWallet = useDollarWallet();
  const recentTransactions = useRecentTransactions();
  const transfers = useTransfers();
  const isSavingsLoading = useSavingsLoading();
  const isWalletLoading = useWalletLoading();
  const isTransactionLoading = useTransactionLoading();
  const darkMode = useDarkMode();

  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [transferForm] = Form.useForm();
  const [withdrawForm] = Form.useForm();
  const [activeTabKey, setActiveTabKey] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const { fetchPlans, fetchSavings, fetchPortfolio } = useSavingsStore();
  const { fetchNairaWallet, fetchDollarWallet, withdrawFunds } =
    useWalletStore();
  const { fetchRecentTransactions, fetchTransfers, createTransfer } =
    useTransactionStore();
  const { showToast } = useUIStore();

  const [chartData, setChartData] = useState<number[]>([]);

  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchPlans(),
          fetchSavings(),
          fetchPortfolio(),
          fetchNairaWallet(),
          fetchDollarWallet(),
          fetchRecentTransactions(5),
          fetchTransfers(),
        ]);
      } catch (error) {
        console.error("Error initializing dashboard data:", error);
        showToast("Failed to load dashboard data. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, []);

  useEffect(() => {
    if (portfolio?.chart) {
      setChartData(portfolio.chart.slice(0, 7));
    }
  }, [portfolio]);

  const calculateMonthlyPercentage = () => {
    if (!portfolio || portfolio.lifetime === 0) return 0;
    return Math.min(
      100,
      Math.round((portfolio.thisMonth / portfolio.lifetime) * 100)
    );
  };

  const calculateWeeklyPercentage = () => {
    if (!portfolio || portfolio.thisMonth === 0) return 0;
    return Math.min(
      100,
      Math.round((portfolio.thisWeek / portfolio.thisMonth) * 100)
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount);
  };

  const getSavingStatus = (saving) => {
    const now = new Date();
    const maturityDate = new Date(saving.until);

    if (maturityDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return "warning";
    }

    if (saving.wallet?.balance >= saving.target) {
      return "success";
    }

    return "processing";
  };

  const getDaysRemaining = (maturityDateString: string) => {
    const now = new Date();
    const maturityDate = new Date(maturityDateString);
    const diffTime = Math.abs(maturityDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleTransfer = async (values) => {
    try {
      setIsLoading(true);
      await createTransfer({
        to_id: values.recipientId,
        amount: values.amount,
        desc: values.description,
      });

      await fetchNairaWallet();

      setTransferSuccess(true);
      setTimeout(() => {
        setIsTransferModalVisible(false);
        setTransferSuccess(false);
        transferForm.resetFields();
      }, 2000);

      showToast("Transfer completed successfully", "success");
    } catch (error) {
      showToast("Transfer failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (values) => {
    try {
      setIsLoading(true);
      await withdrawFunds({
        amount: values.amount,
        wallet_name: "naira",
        account_id: values.accountId,
        pin: values.pin,
      });

      setWithdrawSuccess(true);
      setTimeout(() => {
        setIsWithdrawModalVisible(false);
        setWithdrawSuccess(false);
        withdrawForm.resetFields();
      }, 2000);

      showToast("Withdrawal initiated successfully", "success");
    } catch (error) {
      showToast("Withdrawal failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const savingsColumns = [
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
      dataIndex: "until",
      key: "until",
      render: (date) => (
        <span>
          {date && formatDate(date)}
          <div className="text-xs text-gray-500">
            {date ? getDaysRemaining(date) : "0"} days left
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
          text={
            record.status?.charAt(0).toUpperCase() + record.status?.slice(1)
          }
        />
      ),
    },
  ];

  const transactionColumns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Badge
          status={type === "deposit" ? "success" : "warning"}
          text={type.charAt(0).toUpperCase() + type.slice(1)}
        />
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <span className={amount >= 0 ? "text-green-500" : "text-red-500"}>
          {formatCurrency(Math.abs(amount))}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => formatDateTime(date),
    },
    {
      title: "Reference",
      dataIndex: "uuid",
      key: "uuid",
      render: (uuid) => (
        <span className="text-xs text-gray-500">{uuid.substring(0, 8)}...</span>
      ),
    },
  ];

  const renderLoading = () => (
    <div className="flex justify-center items-center h-64">
      <Spin size="large" tip="Loading your financial data..." />
    </div>
  );

  const renderOverviewTab = () => (
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
                    <BankOutlined className="text-blue-600" /> Total Savings
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
                  {Math.abs(portfolio.balance_change_percentage || 0).toFixed(
                    2
                  )}
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
              actions={[
                <Button
                  type="text"
                  icon={<SendOutlined />}
                  onClick={() => setIsTransferModalVisible(true)}
                  size="small"
                >
                  Transfer
                </Button>,
                <Button
                  type="text"
                  icon={<SwapOutlined />}
                  onClick={() => setIsWithdrawModalVisible(true)}
                  size="small"
                >
                  Withdraw
                </Button>,
              ]}
            >
              <Statistic
                title={
                  <div className="flex items-center gap-2 text-base font-medium">
                    <WalletOutlined className="text-green-600" /> Wallet Balance
                  </div>
                }
                value={nairaWallet?.balance || 0}
                precision={2}
                valueStyle={{ color: "#52c41a", fontSize: "1.5rem" }}
                prefix="₦"
                formatter={(value) => value.toLocaleString()}
              />
              <div className="mt-2">
                <Progress
                  percent={Math.min(
                    100,
                    Math.round(parseFloat(nairaWallet?.balance || "0"))
                  )}
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
                    <CalendarOutlined className="text-purple-600" /> Monthly
                    Savings
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
                    <LineChartOutlined className="text-orange-500" /> Weekly
                    Activity
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
              className={`shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}
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
                  success={{ percent: (portfolio.net.savings || 0) * 0.05 }}
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
              className={`shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}
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
                  <Text className="text-xs text-gray-500">This Month</Text>
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
                  <Text className="text-xs text-gray-500">Overall Growth</Text>
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
                  color={portfolio.balance_change >= 0 ? "success" : "error"}
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

      {/* Recent Activity */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <HistoryOutlined className="text-blue-600" />
                <span>Recent Transactions</span>
              </div>
            }
            className={`shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}
            bordered={false}
            extra={
              <Link href="/transactions">
                <Button type="text" size="small">
                  View All
                </Button>
              </Link>
            }
          >
            {isTransactionLoading ? (
              <div className="flex justify-center py-8">
                <Spin />
              </div>
            ) : recentTransactions && recentTransactions.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={recentTransactions}
                renderItem={(transaction) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={
                            transaction.type === "deposit" ? (
                              <ArrowUpOutlined />
                            ) : (
                              <ArrowDownOutlined />
                            )
                          }
                          style={{
                            backgroundColor:
                              transaction.type === "deposit"
                                ? "#52c41a"
                                : "#f5222d",
                            color: "white",
                          }}
                        />
                      }
                      title={
                        <div className="flex justify-between">
                          <span>
                            {transaction.type.charAt(0).toUpperCase() +
                              transaction.type.slice(1)}
                          </span>
                          <span
                            className={
                              transaction.type === "deposit"
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            {transaction.type === "deposit" ? "+" : "-"}
                            {formatCurrency(Math.abs(transaction.amount))}
                          </span>
                        </div>
                      }
                      description={
                        <div className="flex justify-between text-xs">
                          <span>
                            Ref: {transaction.uuid.substring(0, 8)}...
                          </span>
                          <span>{formatDateTime(transaction.created_at)}</span>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No recent transactions" />
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <SwapOutlined className="text-blue-600" />
                <span>Recent Transfers</span>
              </div>
            }
            className={`shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}
            bordered={false}
            extra={
              <Link href="/transfers">
                <Button type="text" size="small">
                  View All
                </Button>
              </Link>
            }
          >
            {isTransactionLoading ? (
              <div className="flex justify-center py-8">
                <Spin />
              </div>
            ) : transfers && transfers.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={transfers.slice(0, 5)}
                renderItem={(transfer) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<SwapOutlined />}
                          style={{ backgroundColor: "#1890ff" }}
                        />
                      }
                      title={
                        <div className="flex justify-between">
                          <span>Transfer</span>
                          <span>
                            {formatCurrency(transfer.deposit?.amount || 0)}
                          </span>
                        </div>
                      }
                      description={
                        <div className="flex justify-between text-xs">
                          <span>
                            {transfer.from_type.split("\\").pop()} ➜{" "}
                            {transfer.to_type.split("\\").pop()}
                          </span>
                          <span>{formatDateTime(transfer.created_at)}</span>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No recent transfers" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <BankOutlined className="text-blue-600" />
            <span>Quick Actions</span>
          </div>
        }
        className={`shadow mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
        bordered={false}
      >
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              bordered={false}
              className="text-center"
              onClick={() => setIsTransferModalVisible(true)}
              bodyStyle={{ padding: "12px" }}
            >
              <SendOutlined style={{ fontSize: 24, color: "#1890ff" }} />
              <div className="mt-2">Send Money</div>
            </Card>
          </Col>

          <Col xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              bordered={false}
              className="text-center"
              onClick={() => (window.location.href = "/savings/new")}
              bodyStyle={{ padding: "12px" }}
            >
              <PlusOutlined style={{ fontSize: 24, color: "#52c41a" }} />
              <div className="mt-2">New Savings</div>
            </Card>
          </Col>

          <Col xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              bordered={false}
              className="text-center"
              onClick={() => (window.location.href = "/deposit")}
              bodyStyle={{ padding: "12px" }}
            >
              <CreditCardOutlined style={{ fontSize: 24, color: "#722ed1" }} />
              <div className="mt-2">Add Funds</div>
            </Card>
          </Col>

          <Col xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              bordered={false}
              className="text-center"
              onClick={() => setIsWithdrawModalVisible(true)}
              bodyStyle={{ padding: "12px" }}
            >
              <SwapOutlined style={{ fontSize: 24, color: "#fa8c16" }} />
              <div className="mt-2">Withdraw</div>
            </Card>
          </Col>

          <Col xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              bordered={false}
              className="text-center"
              onClick={() => (window.location.href = "/transactions")}
              bodyStyle={{ padding: "12px" }}
            >
              <HistoryOutlined style={{ fontSize: 24, color: "#f5222d" }} />
              <div className="mt-2">History</div>
            </Card>
          </Col>

          <Col xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              bordered={false}
              className="text-center"
              onClick={() => (window.location.href = "/profile")}
              bodyStyle={{ padding: "12px" }}
            >
              <UserOutlined style={{ fontSize: 24, color: "#eb2f96" }} />
              <div className="mt-2">Profile</div>
            </Card>
          </Col>
        </Row>
      </Card>

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
          <Table
            dataSource={savings}
            columns={savingsColumns}
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
        )}
      </Card>
    </>
  );

  const renderTransactionsTab = () => (
    <Card
      className={`shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}
      bordered={false}
    >
      {isTransactionLoading ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : (
        <Tabs defaultActiveKey="all">
          <TabPane tab="All Transactions" key="all">
            <Table
              dataSource={recentTransactions}
              columns={transactionColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane tab="Deposits" key="deposits">
            <Table
              dataSource={recentTransactions?.filter(
                (t) => t.type === "deposit"
              )}
              columns={transactionColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane tab="Withdrawals" key="withdrawals">
            <Table
              dataSource={recentTransactions?.filter(
                (t) => t.type === "withdraw"
              )}
              columns={transactionColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      )}
    </Card>
  );

  const renderWalletsTab = () => (
    <>
      <Row gutter={[16, 16]} className="mb-6">
        {/* Naira Wallet Card */}
        <Col xs={24} md={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <BankOutlined className="text-blue-600" />
                <span>Naira Wallet</span>
              </div>
            }
            className={`shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}
            bordered={false}
            actions={[
              <Button type="link" icon={<PlusOutlined />} href="/deposit">
                Add Funds
              </Button>,
              <Button
                type="link"
                icon={<SwapOutlined />}
                onClick={() => setIsWithdrawModalVisible(true)}
              >
                Withdraw
              </Button>,
              <Button
                type="link"
                icon={<SendOutlined />}
                onClick={() => setIsTransferModalVisible(true)}
              >
                Transfer
              </Button>,
            ]}
          >
            {isWalletLoading ? (
              <div className="flex justify-center py-8">
                <Spin />
              </div>
            ) : nairaWallet ? (
              <div>
                <Statistic
                  value={nairaWallet.balance}
                  precision={2}
                  valueStyle={{ color: "#52c41a" }}
                  prefix="₦"
                  suffix={<small className="text-gray-500">(NGN)</small>}
                  formatter={(value) => parseFloat(value).toLocaleString()}
                />
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Text type="secondary">Wallet ID</Text>
                      <div>{nairaWallet.uuid.substring(0, 8)}...</div>
                    </div>
                    <div>
                      <Text type="secondary">Created</Text>
                      <div>{formatDate(nairaWallet.created_at)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Empty description="Wallet information not available" />
            )}
          </Card>
        </Col>

        {/* Dollar Wallet Card */}
        <Col xs={24} md={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <DollarOutlined className="text-green-600" />
                <span>Dollar Wallet</span>
              </div>
            }
            className={`shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}
            bordered={false}
            actions={[
              <Button
                type="link"
                icon={<PlusOutlined />}
                href="/deposit/dollar"
              >
                Add Funds
              </Button>,
              <Button
                type="link"
                icon={<SwapOutlined />}
                onClick={() => (window.location.href = "/withdraw/dollar")}
              >
                Withdraw
              </Button>,
            ]}
          >
            {isWalletLoading ? (
              <div className="flex justify-center py-8">
                <Spin />
              </div>
            ) : dollarWallet ? (
              <div>
                <Statistic
                  value={dollarWallet.balance}
                  precision={2}
                  valueStyle={{ color: "#52c41a" }}
                  prefix="$"
                  suffix={<small className="text-gray-500">(USD)</small>}
                  formatter={(value) => parseFloat(value).toLocaleString()}
                />
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Text type="secondary">Wallet ID</Text>
                      <div>{dollarWallet.uuid.substring(0, 8)}...</div>
                    </div>
                    <div>
                      <Text type="secondary">Created</Text>
                      <div>{formatDate(dollarWallet.created_at)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Empty description="Wallet information not available" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Recent Transactions for Wallets */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <HistoryOutlined className="text-blue-600" />
            <span>Wallet Transactions</span>
          </div>
        }
        className={`shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}
        bordered={false}
      >
        {isTransactionLoading ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : (
          <Table
            dataSource={recentTransactions?.filter((t) =>
              t.payable_type.includes("User")
            )}
            columns={transactionColumns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        )}
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
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                fetchPortfolio();
                fetchNairaWallet();
                fetchDollarWallet();
                fetchRecentTransactions();
              }}
              loading={isLoading}
            >
              Refresh
            </Button>
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
          className={`shadow-sm mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
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

        {isLoading &&
        isSavingsLoading &&
        isWalletLoading &&
        isTransactionLoading ? (
          renderLoading()
        ) : (
          <>
            {activeTabKey === "overview" && renderOverviewTab()}
            {activeTabKey === "transactions" && renderTransactionsTab()}
            {activeTabKey === "wallets" && renderWalletsTab()}
          </>
        )}

        {/* Money Transfer Modal */}
        <Modal
          title="Send Money"
          open={isTransferModalVisible}
          onCancel={() => {
            setIsTransferModalVisible(false);
            setTransferSuccess(false);
            transferForm.resetFields();
          }}
          footer={null}
        >
          {transferSuccess ? (
            <div className="text-center py-8">
              <CheckCircleOutlined style={{ fontSize: 48, color: "#52c41a" }} />
              <Title level={4} className="mt-4">
                Transfer Successful!
              </Title>
              <Text>Your money has been sent successfully.</Text>
            </div>
          ) : (
            <Form
              form={transferForm}
              layout="vertical"
              onFinish={handleTransfer}
              requiredMark={false}
            >
              <Form.Item
                name="recipientId"
                label="Recipient ID"
                rules={[
                  { required: true, message: "Please enter recipient ID" },
                ]}
              >
                <Input placeholder="Enter user ID or username" />
              </Form.Item>

              <Form.Item
                name="amount"
                label="Amount"
                rules={[
                  { required: true, message: "Please enter amount" },
                  {
                    type: "number",
                    min: 100,
                    message: "Amount must be at least ₦100",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/₦\s?|(,*)/g, "")}
                  placeholder="Enter amount"
                />
              </Form.Item>

              <Form.Item name="description" label="Description (Optional)">
                <Input placeholder="What's this transfer for?" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isLoading}
                >
                  Send Money
                </Button>
              </Form.Item>
            </Form>
          )}
        </Modal>

        {/* Withdrawal Modal */}
        <Modal
          title="Withdraw Funds"
          open={isWithdrawModalVisible}
          onCancel={() => {
            setIsWithdrawModalVisible(false);
            setWithdrawSuccess(false);
            withdrawForm.resetFields();
          }}
          footer={null}
        >
          {withdrawSuccess ? (
            <div className="text-center py-8">
              <CheckCircleOutlined style={{ fontSize: 48, color: "#52c41a" }} />
              <Title level={4} className="mt-4">
                Withdrawal Initiated!
              </Title>
              <Text>Your withdrawal request is being processed.</Text>
            </div>
          ) : (
            <Form
              form={withdrawForm}
              layout="vertical"
              onFinish={handleWithdraw}
              requiredMark={false}
            >
              <Alert
                message="Withdrawal Information"
                description="Withdrawals are processed within 24 hours during business days."
                type="info"
                showIcon
                className="mb-4"
              />

              <Form.Item
                name="accountId"
                label="Account"
                rules={[{ required: true, message: "Please select account" }]}
              >
                <Select placeholder="Select bank account">
                  <Option value={1}>Access Bank - 012345678</Option>
                  <Option value={2}>GTBank - 987654321</Option>
                  <Option value="new">+ Add New Account</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="amount"
                label="Amount"
                rules={[
                  { required: true, message: "Please enter amount" },
                  {
                    type: "number",
                    min: 1000,
                    message: "Minimum withdrawal is ₦1,000",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/₦\s?|(,*)/g, "")}
                  placeholder="Enter amount"
                />
              </Form.Item>

              <Form.Item
                name="pin"
                label="Transaction PIN"
                rules={[
                  { required: true, message: "Please enter your PIN" },
                  { len: 4, message: "PIN must be 4 digits" },
                ]}
              >
                <Input.Password placeholder="Enter 4-digit PIN" maxLength={4} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isLoading}
                >
                  Withdraw Funds
                </Button>
              </Form.Item>
            </Form>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
