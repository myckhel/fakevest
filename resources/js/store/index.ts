import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useAuthStore } from './slices/authStore';
import { useUIStore } from './slices/uiStore';
import { useSavingsStore } from './slices/savingsStore';

// Root store type combining all slice types
export type RootStore = ReturnType<typeof useAuthStore> & 
                        ReturnType<typeof useUIStore> &
                        ReturnType<typeof useSavingsStore>;

// Create the combined store with devtools middleware
export const useStore = create<RootStore>()(
  devtools(
    (...a) => ({
      // Combine all stores
      ...useAuthStore(...a),
      ...useUIStore(...a),
      ...useSavingsStore(...a),
    }),
    { name: 'Fakevest Store' }
  )
);

// Re-export individual store hooks for direct access
export { useAuthStore } from './slices/authStore';
export { useUIStore } from './slices/uiStore';
export { useSavingsStore } from './slices/savingsStore';