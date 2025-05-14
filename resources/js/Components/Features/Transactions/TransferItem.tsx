import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { Avatar, List, Tooltip } from 'antd';
import React from 'react';
import { Transfer } from '../../../Apis/transactions';
import { useAuthUser } from '../../../Stores/authStore';
import { formatCurrency, formatDateTime } from '../../../prev/formatters';

type TransferItemProps = {
  transfer: Transfer;
};

const TransferItem: React.FC<TransferItemProps> = ({ transfer }) => {
  // Get current user from auth store
  const currentUser = useAuthUser();

  // Determine if this is an incoming or outgoing transfer based on current user id
  const isIncoming = currentUser && transfer.to_id === currentUser.id;
  const isOutgoing = currentUser && transfer.from_id === currentUser.id;

  // We'll use this to determine styling and icons
  const transactionType = isIncoming ? 'deposit' : 'withdraw';

  const amount = transfer.withdraw
    ? transfer.withdraw.amount
    : (transfer.deposit?.amount ?? 0);

  // Extract description from meta data if available
  const description =
    transfer.withdraw?.meta?.desc ||
    transfer.deposit?.meta?.desc ||
    `Transfer ${isOutgoing ? 'to' : 'from'} ${isOutgoing ? `user #${transfer.to_id}` : `user #${transfer.from_id}`}`;

  return (
    <List.Item className="dark:border-gray-700">
      <List.Item.Meta
        avatar={
          <Avatar
            icon={
              transfer.status === 'transfer' ? (
                <SwapOutlined />
              ) : isIncoming ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )
            }
            style={{
              backgroundColor:
                transfer.status === 'transfer'
                  ? '#1890ff'
                  : isIncoming
                    ? '#52c41a'
                    : '#f5222d',
              color: 'white',
            }}
          />
        }
        title={
          <div className="flex justify-between dark:text-gray-200">
            <Tooltip title={description}>
              <span className="cursor-help">
                {isIncoming ? 'Incoming' : 'Outgoing'} Transfer
              </span>
            </Tooltip>
            <span className={isIncoming ? 'text-green-500' : 'text-red-500'}>
              {isIncoming ? '+' : '-'}
              {formatCurrency(Math.abs(amount))}
              {transfer.fee !== '0' && (
                <span className="text-xs ml-1 text-gray-500">
                  (Fee: {formatCurrency(Number(transfer.fee))})
                </span>
              )}
            </span>
          </div>
        }
        description={
          <div className="flex flex-col gap-1 text-xs dark:text-gray-400">
            <div className="flex justify-between">
              <span>{description}</span>
              <Tooltip title={transfer.uuid}>
                <span className="cursor-help">
                  ID: {transfer.uuid?.substring(0, 8)}...
                </span>
              </Tooltip>
            </div>
            <div className="flex justify-between">
              <span>{formatDateTime(transfer.created_at)}</span>
            </div>
          </div>
        }
      />
    </List.Item>
  );
};

export default TransferItem;
