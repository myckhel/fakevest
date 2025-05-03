import Http from "./Http";

export interface SavingPlan {
  id: number;
  name: string;
  description: string;
  interest_rate: number;
  type: "flex" | "lock" | "target";
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
  type: "deposit" | "withdrawal" | "interest";
  created_at: string;
}

export interface AutoSaveSetting {
  id: number;
  saving_id: number;
  user_id: number;
  amount: number;
  frequency: "daily" | "weekly" | "monthly";
  day_of_week?: number;
  day_of_month?: number;
  active: boolean;
  next_deduction_date: string;
  created_at: string;
  updated_at: string;
}

export interface SavingStatistics {
  total_saved: number;
  total_interest_earned: number;
  average_monthly_saving: number;
  completed_goals: number;
  active_goals: number;
  savings_growth: Array<{ date: string; amount: number }>;
}

export interface SavingChallenge {
  id: number;
  name: string;
  description: string;
  target_amount: number;
  duration_days: number;
  participants_count: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  joined?: boolean;
}

const SavingsAPI = {
  /**
   * Get all available saving plans
   */
  getPlans: (): Promise<SavingPlan[]> => {
    return Http.get("/plans");
  },

  /**
   * Get all user savings accounts
   */
  getSavings: (): Promise<Saving[]> => {
    return Http.get("/savings");
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
    return Http.post("/savings", data);
  },

  /**
   * Update a saving account
   */
  updateSaving: (
    id: number,
    data: Partial<CreateSavingData>
  ): Promise<Saving> => {
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
  deposit: (
    savingId: number,
    amount: number,
    pin?: string
  ): Promise<Saving> => {
    const data: any = { amount };
    if (pin) data.pin = pin;
    return Http.post(`/savings/${savingId}/deposit`, data);
  },

  /**
   * Withdraw funds from a saving account
   */
  withdraw: (
    savingId: number,
    amount: number,
    pin: string
  ): Promise<Saving> => {
    return Http.post(`/savings/${savingId}/withdraw`, { amount, pin });
  },

  /**
   * Get all auto-save settings for a saving account
   */
  getAutoSaveSettings: (savingId: number): Promise<AutoSaveSetting> => {
    return Http.get(`/savings/${savingId}/auto-save`);
  },

  /**
   * Create or update auto-save setting for a saving account
   */
  setAutoSave: (
    savingId: number,
    data: Omit<
      AutoSaveSetting,
      | "id"
      | "saving_id"
      | "user_id"
      | "created_at"
      | "updated_at"
      | "next_deduction_date"
    >
  ): Promise<AutoSaveSetting> => {
    return Http.post(`/savings/${savingId}/auto-save`, data);
  },

  /**
   * Turn off auto-save for a saving account
   */
  disableAutoSave: (savingId: number): Promise<{ message: string }> => {
    return Http.delete(`/savings/${savingId}/auto-save`);
  },

  /**
   * Get savings statistics
   */
  getSavingsStatistics: (): Promise<SavingStatistics> => {
    return Http.get("/savings/statistics");
  },

  /**
   * Get available savings challenges
   */
  getSavingsChallenges: (): Promise<SavingChallenge[]> => {
    return Http.get("/savings/challenges");
  },

  /**
   * Join a savings challenge
   */
  joinChallenge: (challengeId: number): Promise<{ message: string }> => {
    return Http.post(`/savings/challenges/${challengeId}/join`);
  },

  /**
   * Leave a savings challenge
   */
  leaveChallenge: (challengeId: number): Promise<{ message: string }> => {
    return Http.post(`/savings/challenges/${challengeId}/leave`);
  },

  /**
   * Get user's active challenges
   */
  getUserChallenges: (): Promise<SavingChallenge[]> => {
    return Http.get("/savings/user-challenges");
  },

  /**
   * Get savings progress for a specific timeframe
   */
  getSavingsProgress: (
    timeframe: "weekly" | "monthly" | "yearly" = "monthly"
  ): Promise<Array<{ date: string; amount: number }>> => {
    return Http.get(`/savings/progress?timeframe=${timeframe}`);
  },
};

export default SavingsAPI;
