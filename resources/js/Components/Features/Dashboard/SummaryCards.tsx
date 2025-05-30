import React, { useCallback, useEffect } from 'react';

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BankOutlined,
  CalendarOutlined,
  LineChartOutlined,
  SendOutlined,
  SwapOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Progress, Row, Spin, Statistic } from 'antd';

import { usePortfolioStats } from '@/Hooks/usePortfolioStats';
import useSavingsStore from '@/Stores/savingsStore';
import { useDarkMode } from '@/Stores/uiStore';
import useWalletStore from '@/Stores/walletStore';

type SummaryCardsProps = {
  onTransfer: () => void;
  onWithdraw: () => void;
  onDeposit: () => void;
};

/**
 * Component for displaying the summary cards at the top of the dashboard
 * Encapsulates the data fetching logic for portfolio and wallet data
 */
const SummaryCards: React.FC<SummaryCardsProps> = ({
  onTransfer,
  onWithdraw,
  onDeposit,
}) => {
  // Get dark mode from global store
  const darkMode = useDarkMode();

  // Get store data and actions
  const {
    portfolio,
    fetchPortfolio,
    isLoading: isPortfolioLoading,
  } = useSavingsStore();

  const {
    nairaWallet,
    fetchNairaWallet,
    isLoading: isWalletLoading,
  } = useWalletStore();

  // Calculate portfolio statistics using the custom hook
  const { chartData, isPositiveGrowth, growthPercentage, monthlyPercentage } =
    usePortfolioStats(portfolio);

  // Create memoized functions to prevent infinite re-renders
  const loadPortfolio = useCallback(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const loadNairaWallet = useCallback(() => {
    fetchNairaWallet();
  }, [fetchNairaWallet]);

  // Fetch data when component mounts
  useEffect(() => {
    loadPortfolio();
    loadNairaWallet();
  }, [loadPortfolio, loadNairaWallet]);

  if (isPortfolioLoading || isWalletLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spin size="large" tip="Loading summary data..." />
      </div>
    );
  }

  if (!portfolio) return null;

  return (
    <Row gutter={[16, 16]} className="mb-6">
      {/* Total Savings Card */}
      <Col xs={24} sm={12} md={6}>
        <Card
          className="h-full shadow bg-white dark:bg-gray-800"
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
            valueStyle={{ color: '#3b8cb7', fontSize: '1.5rem' }}
            prefix="₦"
            formatter={(value) => value.toLocaleString()}
          />
          <div className="mt-2">
            <span
              className={isPositiveGrowth ? 'text-green-500' : 'text-red-500'}
            >
              {isPositiveGrowth ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              {Math.abs(growthPercentage || 0).toFixed(2)}%
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
          className="h-full shadow bg-white dark:bg-gray-800"
          bordered={false}
          actions={[
            <Button
              type="text"
              icon={<SendOutlined />}
              onClick={onTransfer}
              size="small"
              key="transfer"
            >
              Transfer
            </Button>,
            <Button
              type="text"
              icon={<SwapOutlined />}
              onClick={onWithdraw}
              size="small"
              key="withdraw"
            >
              Withdraw
            </Button>,
            <Button
              type="text"
              icon={<BankOutlined />}
              onClick={onDeposit}
              size="small"
              key="deposit"
            >
              Deposit
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
            valueStyle={{ color: '#52c41a', fontSize: '1.5rem' }}
            prefix="₦"
            formatter={(value) => value.toLocaleString()}
          />
          <div className="mt-2">
            <Progress
              percent={Math.min(
                100,
                Math.round(parseFloat(nairaWallet?.balance || '0')),
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
          className="h-full shadow bg-white dark:bg-gray-800"
          bordered={false}
        >
          <Statistic
            title={
              <div className="flex items-center gap-2 text-base font-medium">
                <CalendarOutlined className="text-purple-600" /> Monthly Savings
              </div>
            }
            value={portfolio.thisMonth}
            precision={2}
            valueStyle={{ color: '#722ed1', fontSize: '1.5rem' }}
            prefix="₦"
            formatter={(value) => value.toLocaleString()}
          />
          <div className="mt-2">
            <Progress
              percent={monthlyPercentage}
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
          className="h-full shadow bg-white dark:bg-gray-800"
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
            valueStyle={{ color: '#fa8c16', fontSize: '1.5rem' }}
            prefix="₦"
            formatter={(value) => value.toLocaleString()}
          />

          <div className="mt-4 flex justify-between items-end h-10">
            {chartData.map((value: number, index: number) => (
              <div
                key={index}
                className="rounded-t"
                style={{
                  height: `${Math.max(
                    10,
                    (value / Math.max(...chartData, 1)) * 40,
                  )}px`,
                  width: '8px',
                  backgroundColor: darkMode ? '#d87a16' : '#ffd591',
                }}
              />
            ))}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryCards;
