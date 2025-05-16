import { create } from 'zustand';

import API from '@/Apis';
import { PaymentOption } from '@/Apis/paymentOptions';

interface PaymentOptionsState {
  cards: PaymentOption[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCards: () => Promise<void>;
  deleteCard: (id: number) => Promise<void>;
  setDefaultCard: (id: number) => Promise<void>;
}

const usePaymentOptionsStore = create<PaymentOptionsState>((set, get) => ({
  cards: [],
  isLoading: false,
  error: null,

  fetchCards: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: cards } = await API.paymentOptions.getPaymentOptions();
      set({ cards, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching cards:', error);
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch payment cards',
      });
    }
  },

  deleteCard: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await API.paymentOptions.deletePaymentOption(id);
      set((state) => ({
        cards: state.cards.filter((card) => card.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error deleting card:', error);
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to delete card',
      });
      throw error;
    }
  },

  setDefaultCard: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await API.paymentOptions.setDefaultPaymentOption(id);

      // Update cards to reflect new default status
      const currentCards = get().cards;
      const updatedCards = currentCards.map((card) => ({
        ...card,
        isDefault: card.id === id,
      }));

      set({ cards: updatedCards, isLoading: false });
    } catch (error: any) {
      console.error('Error setting default card:', error);
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to set default card',
      });
      throw error;
    }
  },
}));

export default usePaymentOptionsStore;
