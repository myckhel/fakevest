import { StateCreator } from 'zustand';

export interface UIState {
  // State
  sidebarOpen: boolean;
  darkMode: boolean;
  toast: {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | null;
  };
  
  // Actions
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
}

// Create the store
export const useUIStore: StateCreator<UIState> = (set, get) => ({
  // Initial state
  sidebarOpen: false,
  darkMode: localStorage.getItem('darkMode') === 'true',
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
    localStorage.setItem('darkMode', String(newDarkMode));
    
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
      }
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
      }
    });
  },
});