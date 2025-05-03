import React, { useEffect } from "react";
import { Table, Progress, Badge, Button, Empty, Spin } from "antd";
import { Link } from "@inertiajs/react";
import { DollarOutlined } from "@ant-design/icons";
import {
  formatCurrency,
  formatDate,
  getDaysRemaining,
  getSavingStatus,
} from "@/Utils/formatters";
import useSavingsStore from "@/Stores/savingsStore";

type SavingsTableProps = {
  limit?: number;
};

/**
 * Component for displaying user's savings plans in a table
 * Encapsulates data fetching logic for savings plans
 */
const SavingsTable: React.FC<SavingsTableProps> = ({ limit }) => {
  // Get savings data from store with proper selector to minimize re-renders
  const { savings = [], isLoading, fetchSavings } = useSavingsStore();

  // Fetch savings data when component mounts
  useEffect(() => {
    fetchSavings();
  }, []);

  // Apply limit if provided
  const limitedSavings = limit ? savings?.slice(0, limit) : savings;

  const columns = [
    {
      title: "Description",
      dataIndex: "desc",
      key: "desc",
      render: (text: string, record: any) => (
        <Link href={`/savings/${record.id}`}>
          <span className="font-medium">{text}</span>
        </Link>
      ),
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
      render: (plan: any) => plan?.name,
    },
    {
      title: "Target",
      dataIndex: "target",
      key: "target",
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: "Balance",
      dataIndex: "wallet",
      key: "balance",
      render: (wallet: any) => formatCurrency(wallet?.balance || 0),
    },
    {
      title: "Progress",
      key: "progress",
      render: (_: any, record: any) => (
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
      render: (date: string) => (
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
      render: (_: any, record: any) => (
        <Badge
          status={getSavingStatus(record)}
          text={
            record.status?.charAt(0).toUpperCase() + record.status?.slice(1)
          }
        />
      ),
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spin size="large" tip="Loading savings plans..." />
      </div>
    );
  }

  // Empty state
  if (limitedSavings.length === 0) {
    return (
      <Empty
        description={
          <div>
            <p className="mb-4">No savings plans found</p>
            <p className="text-sm text-gray-500">
              Start by creating your first savings goal to track your progress
            </p>
          </div>
        }
      >
        <Link href="/savings/new">
          <Button type="primary">Create First Savings Plan</Button>
        </Link>
      </Empty>
    );
  }

  return (
    <Table
      dataSource={limitedSavings}
      columns={columns}
      rowKey="id"
      pagination={limit ? false : { pageSize: 5 }}
      className="mt-3"
      onRow={(record) => ({
        onClick: () => {
          window.location.href = `/savings/${record.id}`;
        },
        style: { cursor: "pointer" },
      })}
    />
  );
};

export default SavingsTable;
