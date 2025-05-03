import { create } from "zustand";
import axios from "axios";
import { devtools } from "zustand/middleware";

type Wallet = {
  id: number;
  holder_type: string;
  holder_id: number;
  name: string;
  slug: string;
  uuid: string;
  description: string | null;
  meta: Record<string, any>;
  balance: string;
  decimal_places: number;
  created_at: string;
  updated_at: string;
  holder?: any;
};

type WalletStatistics = {
  totalBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  growthRate: number;
  transactionCount: number;
  topWallet?: Wallet;
  recentActivity: Array<any>;
};

type BankAccount = {
  id: number;
  user_id: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

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
  withdrawFunds: (data: {
    amount: number;
    wallet_name: string;
    account_id?: number;
    pin: string;
  }) => Promise<void>;
  depositFunds: (data: {
    amount: number;
    wallet_name: string;
    payment_method: string;
    reference?: string;
  }) => Promise<any>;
  fetchInterests: () => Promise<any[]>;
  acceptInterest: (interestId: number) => Promise<void>;
  fetchWalletTransactions: (
    walletId: number,
    page?: number,
    perPage?: number
  ) => Promise<any>;
  fetchWalletStatistics: () => Promise<void>;
  fetchBankAccounts: () => Promise<void>;
  addBankAccount: (
    bankAccount: Omit<
      BankAccount,
      "id" | "user_id" | "created_at" | "updated_at"
    >
  ) => Promise<BankAccount>;
  deleteBankAccount: (accountId: number) => Promise<void>;
  setDefaultBankAccount: (accountId: number) => Promise<void>;
  transferBetweenWallets: (data: {
    from_wallet_id: number;
    to_wallet_id: number;
    amount: number;
  }) => Promise<any>;
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
          const response = await axios.get("/api/v1/wallets/naira");
          set({ nairaWallet: response.data });
        } catch (err: any) {
          console.error("Error fetching naira wallet:", err);
          set({
            error: err.response?.data?.message || "Error fetching naira wallet",
          });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchDollarWallet: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.get("/api/v1/wallets/dollar");
          set({ dollarWallet: response.data });
        } catch (err: any) {
          console.error("Error fetching dollar wallet:", err);
          set({
            error:
              err.response?.data?.message || "Error fetching dollar wallet",
          });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchAllWallets: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.get("/api/v1/wallets");
          set({ wallets: response.data });
        } catch (err: any) {
          console.error("Error fetching wallets:", err);
          set({
            error: err.response?.data?.message || "Error fetching wallets",
          });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchWalletById: async (walletId: number) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.get(`/api/v1/wallets/${walletId}`);
          return response.data;
        } catch (err: any) {
          console.error(`Error fetching wallet with ID ${walletId}:`, err);
          set({
            error:
              err.response?.data?.message ||
              `Error fetching wallet with ID ${walletId}`,
          });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      withdrawFunds: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.post(
            `/api/v1/wallets/${data.wallet_name}/withdraw`,
            data
          );

          // Refresh wallet data after withdrawal
          if (data.wallet_name === "naira") {
            await get().fetchNairaWallet();
          } else if (data.wallet_name === "dollar") {
            await get().fetchDollarWallet();
          }

          return response.data;
        } catch (err: any) {
          console.error("Error withdrawing funds:", err);
          set({
            error: err.response?.data?.message || "Error withdrawing funds",
          });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      depositFunds: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.post(
            `/api/v1/wallets/${data.wallet_name}/deposit`,
            data
          );

          // Refresh wallet data after deposit
          if (data.wallet_name === "naira") {
            await get().fetchNairaWallet();
          } else if (data.wallet_name === "dollar") {
            await get().fetchDollarWallet();
          }

          return response.data;
        } catch (err: any) {
          console.error("Error depositing funds:", err);
          set({
            error: err.response?.data?.message || "Error depositing funds",
          });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchInterests: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.get("/api/v1/wallets/interests");
          return response.data;
        } catch (err: any) {
          console.error("Error fetching interests:", err);
          set({
            error: err.response?.data?.message || "Error fetching interests",
          });
          return [];
        } finally {
          set({ isLoading: false });
        }
      },

      acceptInterest: async (interestId: number) => {
        try {
          set({ isLoading: true, error: null });
          await axios.post(`/api/v1/wallets/interests/${interestId}/accept`);

          // Refresh wallet data after accepting interest
          await get().fetchNairaWallet();
          await get().fetchDollarWallet();
        } catch (err: any) {
          console.error("Error accepting interest:", err);
          set({
            error: err.response?.data?.message || "Error accepting interest",
          });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchWalletTransactions: async (
        walletId: number,
        page = 1,
        perPage = 15
      ) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.get(
            `/api/v1/wallets/${walletId}/transactions?page=${page}&per_page=${perPage}`
          );
          return response.data;
        } catch (err: any) {
          console.error(
            `Error fetching transactions for wallet ${walletId}:`,
            err
          );
          set({
            error:
              err.response?.data?.message ||
              `Error fetching transactions for wallet ${walletId}`,
          });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchWalletStatistics: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.get("/api/v1/wallets/statistics");
          set({ walletStatistics: response.data });
        } catch (err: any) {
          console.error("Error fetching wallet statistics:", err);
          set({
            error:
              err.response?.data?.message || "Error fetching wallet statistics",
          });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchBankAccounts: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.get("/api/v1/bank-accounts");
          set({ bankAccounts: response.data });
        } catch (err: any) {
          console.error("Error fetching bank accounts:", err);
          set({
            error:
              err.response?.data?.message || "Error fetching bank accounts",
          });
        } finally {
          set({ isLoading: false });
        }
      },

      addBankAccount: async (bankAccount) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.post(
            "/api/v1/bank-accounts",
            bankAccount
          );
          await get().fetchBankAccounts();
          return response.data;
        } catch (err: any) {
          console.error("Error adding bank account:", err);
          set({
            error: err.response?.data?.message || "Error adding bank account",
          });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteBankAccount: async (accountId: number) => {
        try {
          set({ isLoading: true, error: null });
          await axios.delete(`/api/v1/bank-accounts/${accountId}`);
          await get().fetchBankAccounts();
        } catch (err: any) {
          console.error(
            `Error deleting bank account with ID ${accountId}:`,
            err
          );
          set({
            error:
              err.response?.data?.message ||
              `Error deleting bank account with ID ${accountId}`,
          });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      setDefaultBankAccount: async (accountId: number) => {
        try {
          set({ isLoading: true, error: null });
          await axios.put(`/api/v1/bank-accounts/${accountId}/default`);
          await get().fetchBankAccounts();
        } catch (err: any) {
          console.error(
            `Error setting bank account with ID ${accountId} as default:`,
            err
          );
          set({
            error:
              err.response?.data?.message ||
              `Error setting bank account with ID ${accountId} as default`,
          });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      transferBetweenWallets: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.post("/api/v1/wallets/transfer", data);
          await get().fetchAllWallets();
          return response.data;
        } catch (err: any) {
          console.error("Error transferring between wallets:", err);
          set({
            error:
              err.response?.data?.message ||
              "Error transferring between wallets",
          });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    { name: "wallet-store" }
  )
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
