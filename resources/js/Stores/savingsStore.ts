import { create } from "zustand";
import { devtools } from "zustand/middleware";
import API from "../api";
import {
  Saving,
  SavingPlan,
  CreateSavingData,
  SavingHistoryItem,
} from "../api/savings";
import { Portfolio } from "../api/user";

interface SavingsState {
  // State
  plans: SavingPlan[];
  savings: Saving[];
  portfolio: Portfolio | null;
  activeSaving: Saving | null;
  savingHistory: SavingHistoryItem[];
  isLoading: boolean;

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
    pin?: string
  ) => Promise<void>;
  withdrawFromSaving: (
    savingId: number,
    amount: number,
    pin: string
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
      isLoading: false,

      // Actions
      fetchPlans: async () => {
        set({ isLoading: true });
        try {
          const plans = await API.savings.getPlans();
          set({
            plans,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      fetchSavings: async () => {
        set({ isLoading: true });
        try {
          const savings = await API.savings.getSavings();
          set({
            savings,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      fetchPortfolio: async () => {
        set({ isLoading: true });
        try {
          const portfolio = await API.user.getPortfolio();
          set({
            portfolio,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      getSaving: async (id) => {
        set({ isLoading: true });
        try {
          const saving = await API.savings.getSaving(id);
          set({
            activeSaving: saving,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      getSavingHistory: async (savingId) => {
        set({ isLoading: true });
        try {
          const history = await API.savings.getSavingHistory(savingId);
          set({
            savingHistory: history,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      createSaving: async (data) => {
        set({ isLoading: true });
        try {
          const newSaving = await API.savings.createSaving(data);
          set((state) => ({
            savings: [...state.savings, newSaving],
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateSaving: async (id, data) => {
        set({ isLoading: true });
        try {
          const updatedSaving = await API.savings.updateSaving(id, data);
          set((state) => ({
            savings: state.savings.map((saving) =>
              saving.id === id ? updatedSaving : saving
            ),
            activeSaving:
              state.activeSaving?.id === id
                ? updatedSaving
                : state.activeSaving,
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      deleteSaving: async (id) => {
        set({ isLoading: true });
        try {
          await API.savings.deleteSaving(id);
          set((state) => ({
            savings: state.savings.filter((saving) => saving.id !== id),
            activeSaving:
              state.activeSaving?.id === id ? null : state.activeSaving,
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      depositToSaving: async (savingId, amount, pin) => {
        set({ isLoading: true });
        try {
          const updatedSaving = await API.savings.deposit(
            savingId,
            amount,
            pin
          );
          set((state) => ({
            savings: state.savings.map((saving) =>
              saving.id === savingId ? updatedSaving : saving
            ),
            activeSaving:
              state.activeSaving?.id === savingId
                ? updatedSaving
                : state.activeSaving,
            isLoading: false,
          }));

          // Refresh portfolio data after deposit
          get().fetchPortfolio();
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      withdrawFromSaving: async (savingId, amount, pin) => {
        set({ isLoading: true });
        try {
          const updatedSaving = await API.savings.withdraw(
            savingId,
            amount,
            pin
          );
          set((state) => ({
            savings: state.savings.map((saving) =>
              saving.id === savingId ? updatedSaving : saving
            ),
            activeSaving:
              state.activeSaving?.id === savingId
                ? updatedSaving
                : state.activeSaving,
            isLoading: false,
          }));

          // Refresh portfolio data after withdrawal
          get().fetchPortfolio();
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    { name: "SavingsStore" }
  )
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
