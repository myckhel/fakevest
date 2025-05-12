import React, { useCallback, useEffect } from 'react';

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { Link } from '@inertiajs/react';
import { Avatar, Button, Card, Empty, List, Spin } from 'antd';

import { Transaction, Transfer } from '../../../Apis/transactions';
import useTransactionStore from '../../../Stores/transactionStore';
import { formatCurrency, formatDateTime } from '../../../Utils/formatters';

type TransactionsListProps = {
  title?: string;
  emptyText?: string;
  limit?: number;
  showViewAll?: boolean;
  type?: 'all' | 'transfers' | string;
};

/**
 * Component for displaying a list of recent transactions
 * Encapsulates data fetching for transactions
 */
const TransactionsList: React.FC<TransactionsListProps> = ({
  title = 'Recent Transactions',
  emptyText = 'No recent transactions',
  limit = 5,
  showViewAll = true,
  type = 'all',
}) => {
  // Get transaction data with selector to minimize re-renders
  const {
    recentTransactions,
    transfers,
    isLoading,
    fetchRecentTransactions,
    fetchTransfers,
  } = useTransactionStore();

  const renderItem = useCallback(
    (transaction: Transaction | Transfer) => (
      <List.Item className="dark:border-gray-700">
        <List.Item.Meta
          avatar={
            <Avatar
              icon={
                transaction.type === 'deposit' ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
              style={{
                backgroundColor:
                  transaction.type === 'deposit' ? '#52c41a' : '#f5222d',
                color: 'white',
              }}
            />
          }
          title={
            <div className="flex justify-between dark:text-gray-200">
              <span>
                {transaction.type?.charAt(0).toUpperCase() +
                  transaction.type?.slice(1)}
              </span>
              <span
                className={
                  transaction.type === 'deposit'
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {transaction.type === 'deposit' ? '+' : '-'}
                {formatCurrency(Math.abs(transaction.amount))}
              </span>
            </div>
          }
          description={
            <div className="flex justify-between text-xs dark:text-gray-400">
              <span>Ref: {transaction.uuid?.substring(0, 8)}...</span>
              <span>{formatDateTime(transaction.created_at)}</span>
            </div>
          }
        />
      </List.Item>
    ),
    [],
  );

  // Fetch appropriate transaction data when component mounts
  useEffect(() => {
    if (type === 'transfers') {
      fetchTransfers();
    } else {
      fetchRecentTransactions(limit);
    }
  }, [type, limit]);

  const limitedTransactions: Transfer[] | Transaction[] =
    (type === 'transfers' ? transfers : recentTransactions) || [];

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <HistoryOutlined className="text-blue-600 dark:text-blue-400" />
          <span>{title}</span>
        </div>
      }
      className={`shadow bg-white dark:bg-gray-800 dark:text-gray-200`}
      bordered={false}
      extra={
        showViewAll && (
          <Link href={type === 'transfers' ? '/transfers' : '/transactions'}>
            <Button type="text" size="small" className="dark:text-gray-300">
              View All
            </Button>
          </Link>
        )
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : limitedTransactions && limitedTransactions.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={limitedTransactions}
          renderItem={renderItem}
        />
      ) : (
        <Empty description={emptyText} className="dark:text-gray-400" />
      )}
    </Card>
  );
};

export default TransactionsList;
