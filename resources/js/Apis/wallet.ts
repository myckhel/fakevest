import { PaginatedData } from '../utils/interfaces';
import Http from './Http';

export type Wallet = {
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

export type WalletStatistics = {
  totalBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  growthRate: number;
  transactionCount: number;
  topWallet?: Wallet;
  recentActivity: Array<any>;
};

export type BankAccount = {
  id: number;
  user_id: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type WithdrawData = {
  amount: number;
  wallet_name: string;
  account_id?: number;
  pin: string;
};

export type DepositData = {
  amount: number;
  wallet_name: string;
  payment_method: string;
  reference?: string;
};

export type WalletTransferData = {
  wallet_id: number;
  to_wallet_id: number;
  amount: number;
  pin: string;
  description?: string;
};

const WalletAPI = {
  /**
   * Get naira wallet
   */
  getNairaWallet: (): Promise<Wallet> => {
    return Http.get('/wallets/naira');
  },

  /**
   * Get dollar wallet
   */
  getDollarWallet: (): Promise<Wallet> => {
    return Http.get('/wallets/dollar');
  },

  /**
   * Get all wallets
   */
  getAllWallets: (): Promise<PaginatedData<Wallet>> => {
    return Http.get('/wallets');
  },

  /**
   * Get wallet by ID
   */
  getWalletById: (walletId: number): Promise<Wallet> => {
    return Http.get(`/wallets/${walletId}`);
  },

  /**
   * Withdraw funds from wallet
   */
  withdrawFunds: (data: WithdrawData): Promise<any> => {
    return Http.post(`/wallets/${data.wallet_name}/withdraw`, data);
  },

  /**
   * Deposit funds to wallet
   */
  depositFunds: (data: DepositData): Promise<any> => {
    return Http.post(`/wallets/${data.wallet_name}/deposit`, data);
  },

  /**
   * Get wallet interests
   */
  getInterests: (): Promise<any[]> => {
    return Http.get('/wallets/interests');
  },

  /**
   * Accept an interest
   */
  acceptInterest: (interestId: number): Promise<void> => {
    return Http.post(`/wallets/interests/${interestId}/accept`);
  },

  /**
   * Get wallet transactions
   */
  getWalletTransactions: (
    walletId: number,
    page = 1,
    perPage = 15,
  ): Promise<any> => {
    return Http.get(
      `/wallets/${walletId}/transactions?page=${page}&per_page=${perPage}`,
    );
  },

  /**
   * Get wallet statistics
   */
  getWalletStatistics: (): Promise<WalletStatistics> => {
    return Http.get('/wallets/statistics');
  },

  /**
   * Get bank accounts
   */
  getBankAccounts: (): Promise<BankAccount[]> => {
    return Http.get('/bank-accounts');
  },

  /**
   * Add bank account
   */
  addBankAccount: (
    bankAccount: Omit<
      BankAccount,
      'id' | 'user_id' | 'created_at' | 'updated_at'
    >,
  ): Promise<BankAccount> => {
    return Http.post('/bank-accounts', bankAccount);
  },

  /**
   * Delete bank account
   */
  deleteBankAccount: (accountId: number): Promise<void> => {
    return Http.delete(`/bank-accounts/${accountId}`);
  },

  /**
   * Set default bank account
   */
  setDefaultBankAccount: (accountId: number): Promise<void> => {
    return Http.put(`/bank-accounts/${accountId}/default`);
  },

  /**
   * Transfer between wallets
   */
  transferBetweenWallets: (data: WalletTransferData): Promise<any> => {
    return Http.post('/transfers', data);
  },
};

export default WalletAPI;
