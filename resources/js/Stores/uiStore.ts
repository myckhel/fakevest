import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning' | null;
}

interface UIState {
  // State
  sidebarOpen: boolean;
  darkMode: boolean;
  toast: ToastState;

  // Actions
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  showToast: (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning',
  ) => void;
  hideToast: () => void;
}

const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        sidebarOpen: false,
        darkMode: false,
        toast: {
          visible: false,
          message: '',
          type: null,
        },

        // Actions
        toggleSidebar: () => {
          set((state) => ({ sidebarOpen: !state.sidebarOpen }));
        },

        toggleDarkMode: () => {
          const newDarkMode = !get().darkMode;

          // Apply dark mode class to document
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }

          set({ darkMode: newDarkMode });
        },

        showToast: (message, type) => {
          set({
            toast: {
              visible: true,
              message,
              type,
            },
          });

          // Auto-hide toast after 5 seconds
          setTimeout(() => {
            // Only hide if this toast is still showing
            const currentToast = get().toast;
            if (currentToast.visible && currentToast.message === message) {
              get().hideToast();
            }
          }, 5000);
        },

        hideToast: () => {
          set({
            toast: {
              visible: false,
              message: '',
              type: null,
            },
          });
        },
      }),
      {
        name: 'ui-storage', // localStorage key
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          darkMode: state.darkMode,
        }),
      },
    ),
    { name: 'UIStore' },
  ),
);

export default useUIStore;

// State selector hooks for better performance
export const useDarkMode = () => useUIStore((state) => state.darkMode);
export const useSidebarState = () => useUIStore((state) => state.sidebarOpen);
export const useToast = () => useUIStore((state) => state.toast);
