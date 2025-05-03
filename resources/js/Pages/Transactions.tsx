import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";
import { Typography, Tabs, Card, DatePicker, Space, Select } from "antd";
import {
  TransactionOutlined,
  SwapOutlined,
  UploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import TransactionsList from "@/Components/Features/Transactions/TransactionsList";

const { Title } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

/**
 * Transactions page that shows all user transactions
 * with filtering capabilities
 */
const Transactions = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [transactionType, setTransactionType] = useState<string>("all");

  // Handle filtering changes
  const handleDateChange = (dates: any) => {
    setDateRange(dates);
  };

  const handleTypeChange = (value: string) => {
    setTransactionType(value);
  };

  return (
    <MainLayout>
      <Head title="Transactions" />

      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Title level={3} className="mb-2">
            Transactions
          </Title>
          <Typography.Text type="secondary">
            View and filter all your transaction history
          </Typography.Text>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-sm bg-white dark:bg-gray-800">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <Space
              direction="vertical"
              size="middle"
              className="w-full md:w-auto"
            >
              <div>
                <Typography.Text strong className="mr-2">
                  Date Range:
                </Typography.Text>
                <RangePicker
                  onChange={handleDateChange}
                  className="w-full md:w-auto"
                />
              </div>
            </Space>

            <Space
              direction="vertical"
              size="middle"
              className="w-full md:w-auto"
            >
              <div>
                <Typography.Text strong className="mr-2">
                  Type:
                </Typography.Text>
                <Select
                  defaultValue="all"
                  onChange={handleTypeChange}
                  className="w-full md:w-48"
                  options={[
                    { value: "all", label: "All Transactions" },
                    { value: "deposit", label: "Deposits" },
                    { value: "withdrawal", label: "Withdrawals" },
                    { value: "transfer", label: "Transfers" },
                    { value: "savings", label: "Savings" },
                    { value: "interest", label: "Interest" },
                  ]}
                />
              </div>
            </Space>
          </div>
        </Card>

        {/* Tabs for different transaction views */}
        <Card className="shadow bg-white dark:bg-gray-800">
          <Tabs defaultActiveKey="all">
            <TabPane
              tab={
                <span>
                  <TransactionOutlined /> All Transactions
                </span>
              }
              key="all"
            >
              <TransactionsList
                title="All Transactions"
                type="all"
                dateRange={dateRange}
                transactionType={transactionType}
              />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <SwapOutlined /> Transfers
                </span>
              }
              key="transfers"
            >
              <TransactionsList
                title="Transfers"
                type="transfers"
                dateRange={dateRange}
                transactionType={transactionType}
              />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <DownloadOutlined /> Deposits
                </span>
              }
              key="deposits"
            >
              <TransactionsList
                title="Deposits"
                type="deposits"
                dateRange={dateRange}
                transactionType={transactionType}
              />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <UploadOutlined /> Withdrawals
                </span>
              }
              key="withdrawals"
            >
              <TransactionsList
                title="Withdrawals"
                type="withdrawals"
                dateRange={dateRange}
                transactionType={transactionType}
              />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Transactions;
