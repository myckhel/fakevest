// Main stores
export { default as useAuthStore } from "./authStore";
export { default as useUIStore } from "./uiStore";
export { default as useSavingsStore } from "./savingsStore";

// Auth store selectors
export { useAuthUser, useIsAuthenticated, useAuthLoading } from "./authStore";

// UI store selectors
export { useDarkMode, useSidebarState, useToast } from "./uiStore";

// Savings store selectors
export {
  useSavingsPlans,
  useSavingsList,
  usePortfolio,
  useActiveSaving,
  useSavingHistory,
  useSavingsLoading,
} from "./savingsStore";
