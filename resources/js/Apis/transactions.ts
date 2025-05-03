import Http from "./Http";

export type Transaction = {
  id: number;
  payable_type: string;
  payable_id: number;
  wallet_id: number;
  type: "deposit" | "withdraw" | "transfer" | "payment" | "interest" | "fee";
  amount: number;
  confirmed: boolean;
  meta: Record<string, any> | null;
  uuid: string;
  created_at: string;
  updated_at: string;
};

export type Transfer = {
  id: number;
  uuid: string;
  deposit_id: number;
  withdraw_id: number;
  status: string;
  from_type: string;
  from_id: number;
  to_type: string;
  to_id: number;
  discount: number;
  fee: string;
  created_at: string;
  updated_at: string;
  deposit?: Transaction;
  withdraw?: Transaction;
  from?: any;
  to?: any;
};

export type TransactionFilter = {
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  status?: string;
  walletId?: number;
};

export type TransferData = {
  username?: string; // Username of recipient (when transferring to another user)
  wallet_id: number; // ID of the source wallet
  amount: number; // Amount to transfer
  to_wallet_id?: number; // ID of destination wallet (when transferring between own wallets)
  pin: string; // Transaction PIN required for authorization
  description?: string; // Optional description for the transfer
};

export type TransactionResponse = {
  data: Transaction[];
  current_page: number;
  per_page: number;
  total: number;
};

const TransactionsAPI = {
  /**
   * Get transactions with optional pagination and filtering
   */
  getTransactions: (
    page = 1,
    perPage = 15,
    filters?: TransactionFilter
  ): Promise<TransactionResponse> => {
    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    // Add filters if present
    if (filters) {
      if (filters.type) params.append("type", filters.type);
      if (filters.dateFrom) params.append("date_from", filters.dateFrom);
      if (filters.dateTo) params.append("date_to", filters.dateTo);
      if (filters.minAmount)
        params.append("min_amount", filters.minAmount.toString());
      if (filters.maxAmount)
        params.append("max_amount", filters.maxAmount.toString());
      if (filters.status) params.append("status", filters.status);
      if (filters.walletId)
        params.append("wallet_id", filters.walletId.toString());
    }

    return Http.get(`/transactions?${params.toString()}`);
  },

  /**
   * Get recent transactions with a specified limit
   */
  getRecentTransactions: (limit = 5): Promise<TransactionResponse> => {
    return Http.get(`/transactions?per_page=${limit}`);
  },

  /**
   * Get a single transaction by ID
   */
  getTransaction: (id: number | string): Promise<Transaction> => {
    return Http.get(`/transactions/${id}`);
  },

  /**
   * Get transaction summary statistics
   */
  getTransactionSummary: (): Promise<any> => {
    return Http.get("/transactions/summary");
  },

  /**
   * Get all transfers
   */
  getTransfers: (): Promise<Transfer[]> => {
    return Http.get("/transfers");
  },

  /**
   * Get a single transfer by ID
   */
  getTransfer: (id: number | string): Promise<Transfer> => {
    return Http.get(`/transfers/${id}`);
  },

  /**
   * Create a new transfer
   */
  createTransfer: (data: TransferData): Promise<Transfer> => {
    return Http.post("/transfers", data);
  },
};

export default TransactionsAPI;
