import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import API from '../Apis';
import {
  BankAccount,
  DepositData,
  Wallet,
  WalletStatistics,
  WalletTransferData,
  WithdrawData,
} from '../Apis/wallet';

interface WalletState {
  // State
  nairaWallet: Wallet | null;
  dollarWallet: Wallet | null;
  wallets: Wallet[];
  bankAccounts: BankAccount[];
  walletStatistics: WalletStatistics | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchNairaWallet: () => Promise<void>;
  fetchDollarWallet: () => Promise<void>;
  fetchAllWallets: () => Promise<void>;
  fetchWalletById: (walletId: number) => Promise<Wallet>;
  withdrawFunds: (data: WithdrawData) => Promise<any>;
  depositFunds: (data: DepositData) => Promise<any>;
  fetchInterests: () => Promise<any[]>;
  acceptInterest: (interestId: number) => Promise<void>;
  fetchWalletTransactions: (
    walletId: number,
    page?: number,
    perPage?: number,
  ) => Promise<any>;
  fetchWalletStatistics: () => Promise<void>;
  fetchBankAccounts: () => Promise<void>;
  addBankAccount: (
    bankAccount: Omit<
      BankAccount,
      'id' | 'user_id' | 'created_at' | 'updated_at'
    >,
  ) => Promise<BankAccount>;
  deleteBankAccount: (accountId: number) => Promise<void>;
  setDefaultBankAccount: (accountId: number) => Promise<void>;
  transferBetweenWallets: (data: WalletTransferData) => Promise<any>;
}

const useWalletStore = create<WalletState>()(
  devtools(
    (set, get) => ({
      // Initial state
      nairaWallet: null,
      dollarWallet: null,
      wallets: [],
      bankAccounts: [],
      walletStatistics: null,
      isLoading: false,
      error: null,

      // Actions
      fetchNairaWallet: async () => {
        try {
          set({ isLoading: true, error: null });
          const nairaWallet = await API.wallet.getNairaWallet();
          set({
            nairaWallet,
            isLoading: false,
          });
        } catch (err: any) {
          console.error('Error fetching naira wallet:', err);
          set({
            isLoading: false,
            error: err.response?.data?.message || 'Error fetching naira wallet',
          });
          throw err;
        }
      },

      fetchDollarWallet: async () => {
        try {
          set({ isLoading: true, error: null });
          const dollarWallet = await API.wallet.getDollarWallet();
          set({
            dollarWallet,
            isLoading: false,
          });
        } catch (err: any) {
          console.error('Error fetching dollar wallet:', err);
          set({
            isLoading: false,
            error:
              err.response?.data?.message || 'Error fetching dollar wallet',
          });
          throw err;
        }
      },

      fetchAllWallets: async () => {
        try {
          set({ isLoading: true, error: null });
          const { data } = await API.wallet.getAllWallets();
          set({
            wallets: data,
            isLoading: false,
          });
        } catch (err: any) {
          console.error('Error fetching wallets:', err);
          set({
            isLoading: false,
            error: err.response?.data?.message || 'Error fetching wallets',
          });
          throw err;
        }
      },

      fetchWalletById: async (walletId: number) => {
        try {
          set({ isLoading: true, error: null });
          const wallet = await API.wallet.getWalletById(walletId);
          set({ isLoading: false });
          return wallet;
        } catch (err: any) {
          console.error(`Error fetching wallet with ID ${walletId}:`, err);
          set({
            isLoading: false,
            error:
              err.response?.data?.message ||
              `Error fetching wallet with ID ${walletId}`,
          });
          throw err;
        }
      },

      withdrawFunds: async (data: WithdrawData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await API.wallet.withdrawFunds(data);

          // Refresh wallet data after withdrawal
          if (data.wallet_name === 'naira') {
            await get().fetchNairaWallet();
          } else if (data.wallet_name === 'dollar') {
            await get().fetchDollarWallet();
          }

          set({ isLoading: false });
          return response;
        } catch (err: any) {
          console.error('Error withdrawing funds:', err);
          set({
            isLoading: false,
            error: err.response?.data?.message || 'Error withdrawing funds',
          });
          throw err;
        }
      },

      depositFunds: async (data: DepositData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await API.wallet.depositFunds(data);

          // Refresh wallet data after deposit
          if (data.wallet_name === 'naira') {
            await get().fetchNairaWallet();
          } else if (data.wallet_name === 'dollar') {
            await get().fetchDollarWallet();
          }

          set({ isLoading: false });
          return response;
        } catch (err: any) {
          console.error('Error depositing funds:', err);
          set({
            isLoading: false,
            error: err.response?.data?.message || 'Error depositing funds',
          });
          throw err;
        }
      },

      fetchInterests: async () => {
        try {
          set({ isLoading: true, error: null });
          const interests = await API.wallet.getInterests();
          set({ isLoading: false });
          return interests;
        } catch (err: any) {
          console.error('Error fetching interests:', err);
          set({
            isLoading: false,
            error: err.response?.data?.message || 'Error fetching interests',
          });
          return [];
        }
      },

      acceptInterest: async (interestId: number) => {
        try {
          set({ isLoading: true, error: null });
          await API.wallet.acceptInterest(interestId);

          // Refresh wallet data after accepting interest
          await get().fetchNairaWallet();
          await get().fetchDollarWallet();

          set({ isLoading: false });
        } catch (err: any) {
          console.error('Error accepting interest:', err);
          set({
            isLoading: false,
            error: err.response?.data?.message || 'Error accepting interest',
          });
          throw err;
        }
      },

      fetchWalletTransactions: async (
        walletId: number,
        page = 1,
        perPage = 15,
      ) => {
        try {
          set({ isLoading: true, error: null });
          const transactions = await API.wallet.getWalletTransactions(
            walletId,
            page,
            perPage,
          );
          set({ isLoading: false });
          return transactions;
        } catch (err: any) {
          console.error(
            `Error fetching transactions for wallet ${walletId}:`,
            err,
          );
          set({
            isLoading: false,
            error:
              err.response?.data?.message ||
              `Error fetching transactions for wallet ${walletId}`,
          });
          throw err;
        }
      },

      fetchWalletStatistics: async () => {
        try {
          set({ isLoading: true, error: null });
          const statistics = await API.wallet.getWalletStatistics();
          set({
            walletStatistics: statistics,
            isLoading: false,
          });
        } catch (err: any) {
          console.error('Error fetching wallet statistics:', err);
          set({
            isLoading: false,
            error:
              err.response?.data?.message || 'Error fetching wallet statistics',
          });
          throw err;
        }
      },

      fetchBankAccounts: async () => {
        try {
          set({ isLoading: true, error: null });
          const bankAccounts = await API.wallet.getBankAccounts();
          set({
            bankAccounts,
            isLoading: false,
          });
        } catch (err: any) {
          console.error('Error fetching bank accounts:', err);
          set({
            isLoading: false,
            error:
              err.response?.data?.message || 'Error fetching bank accounts',
          });
          throw err;
        }
      },

      addBankAccount: async (bankAccount) => {
        try {
          set({ isLoading: true, error: null });
          const newAccount = await API.wallet.addBankAccount(bankAccount);
          await get().fetchBankAccounts();
          set({ isLoading: false });
          return newAccount;
        } catch (err: any) {
          console.error('Error adding bank account:', err);
          set({
            isLoading: false,
            error: err.response?.data?.message || 'Error adding bank account',
          });
          throw err;
        }
      },

      deleteBankAccount: async (accountId: number) => {
        try {
          set({ isLoading: true, error: null });
          await API.wallet.deleteBankAccount(accountId);
          await get().fetchBankAccounts();
          set({ isLoading: false });
        } catch (err: any) {
          console.error(
            `Error deleting bank account with ID ${accountId}:`,
            err,
          );
          set({
            isLoading: false,
            error:
              err.response?.data?.message ||
              `Error deleting bank account with ID ${accountId}`,
          });
          throw err;
        }
      },

      setDefaultBankAccount: async (accountId: number) => {
        try {
          set({ isLoading: true, error: null });
          await API.wallet.setDefaultBankAccount(accountId);
          await get().fetchBankAccounts();
          set({ isLoading: false });
        } catch (err: any) {
          console.error(
            `Error setting bank account with ID ${accountId} as default:`,
            err,
          );
          set({
            isLoading: false,
            error:
              err.response?.data?.message ||
              `Error setting bank account with ID ${accountId} as default`,
          });
          throw err;
        }
      },

      transferBetweenWallets: async (data: WalletTransferData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await API.wallet.transferBetweenWallets(data);

          // Refresh wallet data after transfer
          await get().fetchAllWallets();

          set({ isLoading: false });
          return response;
        } catch (err: any) {
          console.error('Error transferring between wallets:', err);
          set({
            isLoading: false,
            error:
              err.response?.data?.message ||
              'Error transferring between wallets',
          });
          throw err;
        }
      },
    }),
    { name: 'wallet-store' },
  ),
);

export default useWalletStore;

// Custom selectors for specific pieces of state to minimize re-renders
export const useNairaWallet = () =>
  useWalletStore((state) => state.nairaWallet);
export const useDollarWallet = () =>
  useWalletStore((state) => state.dollarWallet);
export const useWallets = () => useWalletStore((state) => state.wallets);
export const useWalletLoading = () =>
  useWalletStore((state) => state.isLoading);
export const useWalletError = () => useWalletStore((state) => state.error);
export const useBankAccounts = () =>
  useWalletStore((state) => state.bankAccounts);
export const useWalletStatistics = () =>
  useWalletStore((state) => state.walletStatistics);
