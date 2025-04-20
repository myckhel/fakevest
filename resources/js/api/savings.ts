import Http from './Http';

export interface SavingPlan {
  id: number;
  name: string;
  description: string;
  interest_rate: number;
  type: 'flex' | 'lock' | 'target';
  min_amount?: number;
  min_duration?: number;
  created_at: string;
  updated_at: string;
}

export interface SavingWallet {
  id: number;
  balance: number;
  holder_id: number;
  holder_type: string;
}

export interface Saving {
  id: number;
  user_id: number;
  plan_id: number;
  desc: string;
  amount: number;
  target: number;
  start_date: string;
  maturity_date: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  plan: SavingPlan;
  wallet?: SavingWallet;
}

export interface CreateSavingData {
  plan_id: number;
  desc: string;
  amount: number;
  target?: number;
  maturity_date?: string;
}

export interface SavingHistoryItem {
  id: number;
  saving_id: number;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'interest';
  created_at: string;
}

const SavingsAPI = {
  /**
   * Get all available saving plans
   */
  getPlans: (): Promise<SavingPlan[]> => {
    return Http.get('/plans');
  },

  /**
   * Get all user savings accounts
   */
  getSavings: (): Promise<Saving[]> => {
    return Http.get('/savings');
  },

  /**
   * Get a specific saving account
   */
  getSaving: (id: number): Promise<Saving> => {
    return Http.get(`/savings/${id}`);
  },

  /**
   * Create a new saving account
   */
  createSaving: (data: CreateSavingData): Promise<Saving> => {
    return Http.post('/savings', data);
  },

  /**
   * Update a saving account
   */
  updateSaving: (id: number, data: Partial<CreateSavingData>): Promise<Saving> => {
    return Http.put(`/savings/${id}`, data);
  },

  /**
   * Delete a saving account
   */
  deleteSaving: (id: number): Promise<{ message: string }> => {
    return Http.delete(`/savings/${id}`);
  },

  /**
   * Get saving history/transactions
   */
  getSavingHistory: (savingId: number): Promise<SavingHistoryItem[]> => {
    return Http.get(`/savings/${savingId}/history`);
  },

  /**
   * Deposit funds to a saving account
   */
  deposit: (savingId: number, amount: number, pin?: string): Promise<Saving> => {
    const data: any = { amount };
    if (pin) data.pin = pin;
    return Http.post(`/savings/${savingId}/deposit`, data);
  },

  /**
   * Withdraw funds from a saving account
   */
  withdraw: (savingId: number, amount: number, pin: string): Promise<Saving> => {
    return Http.post(`/savings/${savingId}/withdraw`, { amount, pin });
  }
};

export default SavingsAPI;