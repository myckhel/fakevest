/**
 * Utility functions for formatting values across the application
 */

/**
 * Formats a number as Nigerian Naira currency
 */
export const formatCurrency = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
};

/**
 * Formats a date in the standard format: DD MMM YYYY
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Formats a date with time: DD MMM YYYY, HH:MM
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Calculates number of days remaining until a date
 */
export const getDaysRemaining = (maturityDateString: string): number => {
  if (!maturityDateString) return 0;
  const now = new Date();
  const maturityDate = new Date(maturityDateString);
  const diffTime = Math.abs(maturityDate.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Determines status color based on saving details
 */
export const getSavingStatus = (
  saving: any,
): 'warning' | 'success' | 'processing' => {
  if (!saving) return 'processing';

  const now = new Date();
  const maturityDate = new Date(saving.until);

  if (maturityDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return 'warning';
  }

  if (saving.wallet?.balance >= saving.target) {
    return 'success';
  }

  return 'processing';
};
