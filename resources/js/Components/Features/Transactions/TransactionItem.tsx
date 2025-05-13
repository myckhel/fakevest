import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Avatar, List } from 'antd';
import React from 'react';
import { Transaction } from '../../../Apis/transactions';
import { formatCurrency, formatDateTime } from '../../../Utils/formatters';

type TransactionItemProps = {
  transaction: Transaction;
};

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  return (
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
  );
};

export default TransactionItem;
