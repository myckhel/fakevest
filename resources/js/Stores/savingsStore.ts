import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import API from '../Apis';
import {
  Saving,
  SavingPlan,
  CreateSavingData,
  SavingHistoryItem,
  AutoSaveSetting,
  SavingStatistics,
  SavingChallenge,
} from '../Apis/savings';
import { Portfolio } from '../Apis/user';

interface SavingsState {
  // State
  plans: SavingPlan[];
  savings: Saving[];
  portfolio: Portfolio | null;
  activeSaving: Saving | null;
  savingHistory: SavingHistoryItem[];
  autoSaveSettings: AutoSaveSetting | null;
  savingStatistics: SavingStatistics | null;
  availableChallenges: SavingChallenge[];
  userChallenges: SavingChallenge[];
  savingsProgress: Array<{ date: string; amount: number }>;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPlans: () => Promise<void>;
  fetchSavings: () => Promise<void>;
  fetchPortfolio: () => Promise<void>;
  getSaving: (id: number) => Promise<void>;
  getSavingHistory: (savingId: number) => Promise<void>;
  createSaving: (data: CreateSavingData) => Promise<void>;
  updateSaving: (id: number, data: Partial<CreateSavingData>) => Promise<void>;
  deleteSaving: (id: number) => Promise<void>;
  depositToSaving: (
    savingId: number,
    amount: number,
    pin?: string,
  ) => Promise<void>;
  withdrawFromSaving: (
    savingId: number,
    amount: number,
    pin: string,
  ) => Promise<void>;
  fetchAutoSaveSettings: (savingId: number) => Promise<void>;
  createOrUpdateAutoSave: (
    savingId: number,
    data: Omit<
      AutoSaveSetting,
      | 'id'
      | 'saving_id'
      | 'user_id'
      | 'created_at'
      | 'updated_at'
      | 'next_deduction_date'
    >,
  ) => Promise<void>;
  disableAutoSave: (savingId: number) => Promise<void>;
  fetchSavingStatistics: () => Promise<void>;
  fetchAvailableChallenges: () => Promise<void>;
  fetchUserChallenges: () => Promise<void>;
  joinChallenge: (challengeId: number) => Promise<void>;
  leaveChallenge: (challengeId: number) => Promise<void>;
  fetchSavingsProgress: (
    timeframe: 'weekly' | 'monthly' | 'yearly',
  ) => Promise<void>;
}

const useSavingsStore = create<SavingsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      plans: [],
      savings: [],
      portfolio: null,
      activeSaving: null,
      savingHistory: [],
      autoSaveSettings: null,
      savingStatistics: null,
      availableChallenges: [],
      userChallenges: [],
      savingsProgress: [],
      isLoading: false,
      error: null,

      // Actions
      fetchPlans: async () => {
        set({ isLoading: true, error: null });
        try {
          const plans = await API.savings.getPlans();
          set({
            plans,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('Error fetching saving plans:', error);
          set({
            isLoading: false,
            error: error.message || 'Error fetching saving plans',
          });
          throw error;
        }
      },

      fetchSavings: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data: savings } = await API.savings.getSavings();
          set({
            savings,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('Error fetching savings:', error);
          set({
            isLoading: false,
            error: error.message || 'Error fetching savings',
          });
          throw error;
        }
      },

      fetchPortfolio: async () => {
        set({ isLoading: true, error: null });
        try {
          const portfolio = await API.user.getPortfolio();
          set({
            portfolio,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('Error fetching portfolio:', error);
          set({
            isLoading: false,
            error: error.message || 'Error fetching portfolio',
          });
          throw error;
        }
      },

      getSaving: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const saving = await API.savings.getSaving(id);
          set({
            activeSaving: saving,
            isLoading: false,
          });
        } catch (error: any) {
          console.error(`Error fetching saving with id ${id}:`, error);
          set({
            isLoading: false,
            error: error.message || `Error fetching saving with id ${id}`,
          });
          throw error;
        }
      },

      getSavingHistory: async (savingId) => {
        set({ isLoading: true, error: null });
        try {
          const history = await API.savings.getSavingHistory(savingId);
          set({
            savingHistory: history,
            isLoading: false,
          });
        } catch (error: any) {
          console.error(
            `Error fetching history for saving ${savingId}:`,
            error,
          );
          set({
            isLoading: false,
            error:
              error.message || `Error fetching history for saving ${savingId}`,
          });
          throw error;
        }
      },

      createSaving: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const newSaving = await API.savings.createSaving(data);
          set((state) => ({
            savings: [...state.savings, newSaving],
            isLoading: false,
          }));
        } catch (error: any) {
          console.error('Error creating saving:', error);
          set({
            isLoading: false,
            error: error.message || 'Error creating saving',
          });
          throw error;
        }
      },

      updateSaving: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
          const updatedSaving = await API.savings.updateSaving(id, data);
          set((state) => ({
            savings: state.savings.map((saving) =>
              saving.id === id ? updatedSaving : saving,
            ),
            activeSaving:
              state.activeSaving?.id === id
                ? updatedSaving
                : state.activeSaving,
            isLoading: false,
          }));
        } catch (error: any) {
          console.error(`Error updating saving ${id}:`, error);
          set({
            isLoading: false,
            error: error.message || `Error updating saving ${id}`,
          });
          throw error;
        }
      },

      deleteSaving: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await API.savings.deleteSaving(id);
          set((state) => ({
            savings: state.savings.filter((saving) => saving.id !== id),
            activeSaving:
              state.activeSaving?.id === id ? null : state.activeSaving,
            isLoading: false,
          }));
        } catch (error: any) {
          console.error(`Error deleting saving ${id}:`, error);
          set({
            isLoading: false,
            error: error.message || `Error deleting saving ${id}`,
          });
          throw error;
        }
      },

      depositToSaving: async (savingId, amount, pin) => {
        set({ isLoading: true, error: null });
        try {
          const updatedSaving = await API.savings.deposit(
            savingId,
            amount,
            pin,
          );
          set((state) => ({
            savings: state.savings.map((saving) =>
              saving.id === savingId ? updatedSaving : saving,
            ),
            activeSaving:
              state.activeSaving?.id === savingId
                ? updatedSaving
                : state.activeSaving,
            isLoading: false,
          }));

          // Refresh portfolio data after deposit
          get().fetchPortfolio();
        } catch (error: any) {
          console.error(`Error depositing to saving ${savingId}:`, error);
          set({
            isLoading: false,
            error: error.message || `Error depositing to saving ${savingId}`,
          });
          throw error;
        }
      },

      withdrawFromSaving: async (savingId, amount, pin) => {
        set({ isLoading: true, error: null });
        try {
          const updatedSaving = await API.savings.withdraw(
            savingId,
            amount,
            pin,
          );
          set((state) => ({
            savings: state.savings.map((saving) =>
              saving.id === savingId ? updatedSaving : saving,
            ),
            activeSaving:
              state.activeSaving?.id === savingId
                ? updatedSaving
                : state.activeSaving,
            isLoading: false,
          }));

          // Refresh portfolio data after withdrawal
          get().fetchPortfolio();
        } catch (error: any) {
          console.error(`Error withdrawing from saving ${savingId}:`, error);
          set({
            isLoading: false,
            error: error.message || `Error withdrawing from saving ${savingId}`,
          });
          throw error;
        }
      },

      fetchAutoSaveSettings: async (savingId) => {
        set({ isLoading: true, error: null });
        try {
          const settings = await API.savings.getAutoSaveSettings(savingId);
          set({
            autoSaveSettings: settings,
            isLoading: false,
          });
        } catch (error: any) {
          console.error(
            `Error fetching auto-save settings for saving ${savingId}:`,
            error,
          );
          set({
            isLoading: false,
            error:
              error.message ||
              `Error fetching auto-save settings for saving ${savingId}`,
          });
          throw error;
        }
      },

      createOrUpdateAutoSave: async (savingId, data) => {
        set({ isLoading: true, error: null });
        try {
          const settings = await API.savings.setAutoSave(savingId, data);
          set({
            autoSaveSettings: settings,
            isLoading: false,
          });
        } catch (error: any) {
          console.error(
            `Error setting auto-save for saving ${savingId}:`,
            error,
          );
          set({
            isLoading: false,
            error:
              error.message || `Error setting auto-save for saving ${savingId}`,
          });
          throw error;
        }
      },

      disableAutoSave: async (savingId) => {
        set({ isLoading: true, error: null });
        try {
          await API.savings.disableAutoSave(savingId);
          set({
            autoSaveSettings: null,
            isLoading: false,
          });
        } catch (error: any) {
          console.error(
            `Error disabling auto-save for saving ${savingId}:`,
            error,
          );
          set({
            isLoading: false,
            error:
              error.message ||
              `Error disabling auto-save for saving ${savingId}`,
          });
          throw error;
        }
      },

      fetchSavingStatistics: async () => {
        set({ isLoading: true, error: null });
        try {
          const statistics = await API.savings.getSavingsStatistics();
          set({
            savingStatistics: statistics,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('Error fetching saving statistics:', error);
          set({
            isLoading: false,
            error: error.message || 'Error fetching saving statistics',
          });
          throw error;
        }
      },

      fetchAvailableChallenges: async () => {
        set({ isLoading: true, error: null });
        try {
          const challenges = await API.savings.getSavingsChallenges();
          set({
            availableChallenges: challenges,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('Error fetching available challenges:', error);
          set({
            isLoading: false,
            error: error.message || 'Error fetching available challenges',
          });
          throw error;
        }
      },

      fetchUserChallenges: async () => {
        set({ isLoading: true, error: null });
        try {
          const challenges = await API.savings.getUserChallenges();
          set({
            userChallenges: challenges,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('Error fetching user challenges:', error);
          set({
            isLoading: false,
            error: error.message || 'Error fetching user challenges',
          });
          throw error;
        }
      },

      joinChallenge: async (challengeId) => {
        set({ isLoading: true, error: null });
        try {
          await API.savings.joinChallenge(challengeId);

          // Refresh challenges lists
          await get().fetchAvailableChallenges();
          await get().fetchUserChallenges();

          set({ isLoading: false });
        } catch (error: any) {
          console.error(`Error joining challenge ${challengeId}:`, error);
          set({
            isLoading: false,
            error: error.message || `Error joining challenge ${challengeId}`,
          });
          throw error;
        }
      },

      leaveChallenge: async (challengeId) => {
        set({ isLoading: true, error: null });
        try {
          await API.savings.leaveChallenge(challengeId);

          // Refresh challenges lists
          await get().fetchAvailableChallenges();
          await get().fetchUserChallenges();

          set({ isLoading: false });
        } catch (error: any) {
          console.error(`Error leaving challenge ${challengeId}:`, error);
          set({
            isLoading: false,
            error: error.message || `Error leaving challenge ${challengeId}`,
          });
          throw error;
        }
      },

      fetchSavingsProgress: async (timeframe = 'monthly') => {
        set({ isLoading: true, error: null });
        try {
          const progress = await API.savings.getSavingsProgress(timeframe);
          set({
            savingsProgress: progress,
            isLoading: false,
          });
        } catch (error: any) {
          console.error(
            `Error fetching savings progress for ${timeframe} timeframe:`,
            error,
          );
          set({
            isLoading: false,
            error:
              error.message ||
              `Error fetching savings progress for ${timeframe} timeframe`,
          });
          throw error;
        }
      },
    }),
    { name: 'SavingsStore' },
  ),
);

export default useSavingsStore;

// State selector hooks for better performance
export const useSavingsPlans = () => useSavingsStore((state) => state.plans);
export const useSavingsList = () => useSavingsStore((state) => state.savings);
export const usePortfolio = () => useSavingsStore((state) => state.portfolio);
export const useActiveSaving = () =>
  useSavingsStore((state) => state.activeSaving);
export const useSavingHistory = () =>
  useSavingsStore((state) => state.savingHistory);
export const useSavingsLoading = () =>
  useSavingsStore((state) => state.isLoading);
export const useSavingsError = () => useSavingsStore((state) => state.error);
export const useAutoSaveSettings = () =>
  useSavingsStore((state) => state.autoSaveSettings);
export const useSavingStatistics = () =>
  useSavingsStore((state) => state.savingStatistics);
export const useAvailableChallenges = () =>
  useSavingsStore((state) => state.availableChallenges);
export const useUserChallenges = () =>
  useSavingsStore((state) => state.userChallenges);
export const useSavingsProgress = () =>
  useSavingsStore((state) => state.savingsProgress);
