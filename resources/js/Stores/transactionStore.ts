import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import API from '../Apis';
import {
  Transaction,
  TransactionFilter,
  Transfer,
  TransferData,
} from '../Apis/transactions';

interface TransactionState {
  // State
  transactions: Transaction[];
  recentTransactions: Transaction[];
  transfers: Transfer[];
  currentTransaction: Transaction | null;
  currentTransfer: Transfer | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
  };

  // Actions
  fetchTransactions: (
    page?: number,
    perPage?: number,
    filters?: TransactionFilter,
  ) => Promise<void>;
  fetchRecentTransactions: (limit: number) => Promise<void>;
  fetchTransfers: () => Promise<void>;
  fetchTransaction: (id: number | string) => Promise<void>;
  fetchTransfer: (id: number | string) => Promise<void>;
  createTransfer: (data: TransferData) => Promise<Transfer>;
  getTransactionsByDateRange: (
    dateFrom: string,
    dateTo: string,
  ) => Promise<void>;
  getTransactionsByType: (type: string) => Promise<void>;
  getTransactionSummary: () => Promise<any>;
}

const useTransactionStore = create<TransactionState>()(
  devtools(
    (set, get) => ({
      // Initial state
      transactions: [],
      recentTransactions: [],
      transfers: [],
      currentTransaction: null,
      currentTransfer: null,
      isLoading: false,
      error: null,
      pagination: {
        currentPage: 1,
        perPage: 15,
        total: 0,
      },

      // Actions
      fetchTransactions: async (
        page = 1,
        perPage = 15,
        filters?: TransactionFilter,
      ) => {
        try {
          set({ isLoading: true, error: null });

          const response = await API.transactions.getTransactions(
            page,
            perPage,
            filters,
          );

          set({
            transactions: response.data,
            pagination: {
              currentPage: response.current_page,
              perPage: response.per_page,
              total: response.total,
            },
            isLoading: false,
          });
        } catch (err: any) {
          console.error('Error fetching transactions:', err);
          set({
            isLoading: false,
            error: err.response?.data?.message || 'Error fetching transactions',
          });
          throw err;
        }
      },

      fetchRecentTransactions: async (limit = 5) => {
        try {
          set({ isLoading: true, error: null });
          const response = await API.transactions.getRecentTransactions(limit);
          set({
            recentTransactions: response.data,
            isLoading: false,
          });
        } catch (err: any) {
          console.error('Error fetching recent transactions:', err);
          set({
            isLoading: false,
            error:
              err.response?.data?.message ||
              'Error fetching recent transactions',
          });
          throw err;
        }
      },

      fetchTransfers: async () => {
        try {
          set({ isLoading: true, error: null });
          const transfers = await API.transactions.getTransfers();
          set({
            transfers,
            isLoading: false,
          });
        } catch (err: any) {
          console.error('Error fetching transfers:', err);
          set({
            isLoading: false,
            error: err.response?.data?.message || 'Error fetching transfers',
          });
          throw err;
        }
      },

      fetchTransaction: async (id: number | string) => {
        try {
          set({ isLoading: true, error: null });
          const transaction = await API.transactions.getTransaction(id);
          set({
            currentTransaction: transaction,
            isLoading: false,
          });
        } catch (err: any) {
          console.error('Error fetching transaction details:', err);
          set({
            isLoading: false,
            error:
              err.response?.data?.message ||
              'Error fetching transaction details',
          });
          throw err;
        }
      },

      fetchTransfer: async (id: number | string) => {
        try {
          set({ isLoading: true, error: null });
          const transfer = await API.transactions.getTransfer(id);
          set({
            currentTransfer: transfer,
            isLoading: false,
          });
        } catch (err: any) {
          console.error('Error fetching transfer details:', err);
          set({
            isLoading: false,
            error:
              err.response?.data?.message || 'Error fetching transfer details',
          });
          throw err;
        }
      },

      createTransfer: async (data: TransferData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await API.transactions.createTransfer(data);

          // Refresh transfers list
          await get().fetchTransfers();
          await get().fetchRecentTransactions(5);

          set({ isLoading: false });
          return response;
        } catch (err: any) {
          console.error('Error creating transfer:', err);
          set({
            isLoading: false,
            error: err.response?.data?.message || 'Error creating transfer',
          });
          throw err;
        }
      },

      getTransactionsByDateRange: async (dateFrom: string, dateTo: string) => {
        try {
          set({ isLoading: true, error: null });
          const filters: TransactionFilter = {
            dateFrom,
            dateTo,
          };

          const response = await API.transactions.getTransactions(
            1,
            15,
            filters,
          );

          set({
            transactions: response.data,
            isLoading: false,
          });

          return response;
        } catch (err: any) {
          console.error('Error fetching transactions by date range:', err);
          set({
            isLoading: false,
            error:
              err.response?.data?.message ||
              'Error fetching transactions by date range',
          });
          throw err;
        }
      },

      getTransactionsByType: async (type: string) => {
        try {
          set({ isLoading: true, error: null });
          const filters: TransactionFilter = { type };
          const response = await API.transactions.getTransactions(
            1,
            15,
            filters,
          );

          set({
            transactions: response.data,
            isLoading: false,
          });

          return response;
        } catch (err: any) {
          console.error('Error fetching transactions by type:', err);
          set({
            isLoading: false,
            error:
              err.response?.data?.message ||
              'Error fetching transactions by type',
          });
          throw err;
        }
      },

      getTransactionSummary: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await API.transactions.getTransactionSummary();
          set({ isLoading: false });
          return response;
        } catch (err: any) {
          console.error('Error fetching transaction summary:', err);
          set({
            isLoading: false,
            error:
              err.response?.data?.message ||
              'Error fetching transaction summary',
          });
          throw err;
        }
      },
    }),
    { name: 'transaction-store' },
  ),
);

export default useTransactionStore;

// Custom selectors for specific pieces of state to minimize re-renders
export const useRecentTransactions = () =>
  useTransactionStore((state) => state.recentTransactions);
export const useTransfers = () =>
  useTransactionStore((state) => state.transfers);
export const useCurrentTransaction = () =>
  useTransactionStore((state) => state.currentTransaction);
export const useCurrentTransfer = () =>
  useTransactionStore((state) => state.currentTransfer);
export const useTransactionLoading = () =>
  useTransactionStore((state) => state.isLoading);
export const useTransactionError = () =>
  useTransactionStore((state) => state.error);
export const useTransactions = () =>
  useTransactionStore((state) => state.transactions);
export const usePagination = () =>
  useTransactionStore((state) => state.pagination);
