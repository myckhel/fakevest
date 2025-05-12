import { useMemo } from 'react';

/**
 * Custom hook for calculating portfolio statistics
 */
export const usePortfolioStats = (portfolio: any) => {
  const monthlyPercentage = useMemo(() => {
    if (!portfolio || portfolio.lifetime === 0) return 0;
    return Math.min(
      100,
      Math.round((portfolio.thisMonth / portfolio.lifetime) * 100),
    );
  }, [portfolio]);

  const weeklyPercentage = useMemo(() => {
    if (!portfolio || portfolio.thisMonth === 0) return 0;
    return Math.min(
      100,
      Math.round((portfolio.thisWeek / portfolio.thisMonth) * 100),
    );
  }, [portfolio]);

  const chartData = useMemo(() => {
    if (!portfolio?.chart) return [];
    return portfolio.chart.slice(0, 7);
  }, [portfolio]);

  return {
    monthlyPercentage,
    weeklyPercentage,
    chartData,
    isPositiveGrowth: portfolio?.balance_change >= 0,
    growthPercentage: portfolio?.balance_change_percentage,
  };
};
