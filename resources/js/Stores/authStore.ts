import { router } from '@inertiajs/react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

import { inertiaApi } from '@/utils/inertiaApi';

import API from '../Apis';
import { LoginCredentials, RegisterData, User } from '../Apis/auth';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Direct state setter for external updates (e.g. from Inertia shared data)
  set: (partial: Partial<Omit<AuthState, 'set'>>) => void;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData, avatar?: File) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  refreshUser: () => Promise<User | null>; // Added for PIN updates
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  getSocialLoginUrl: (
    provider: 'google' | 'github' | 'facebook',
  ) => Promise<string>;
  handleSocialLogin: (
    provider: 'google' | 'github' | 'facebook',
    code: string,
  ) => Promise<void>;
  forgotPassword: (
    email: string,
  ) => Promise<{ message: string; status: boolean }>;
  resetPassword: (data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<{ message: string; status: boolean }>;
  changePassword: (data: {
    old_password: string;
    password: string;
    password_confirmation: string;
  }) => Promise<{ message: string; status: boolean }>;
  resendEmailVerification: () => Promise<{ status: string }>;
  verifyEmail: (id: string, hash: string) => Promise<{ status: string }>;
}

// Create the store with persistence and devtools
const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,

        // Direct state setter for external updates
        set: (partial) => set(partial),

        // Actions
        login: async (credentials) => {
          set({ isLoading: true });
          try {
            const response = await API.auth.login(credentials);
            const { user } = response;

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });

            // Use Inertia to navigate to dashboard after login
            router.visit('/dashboard');
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        register: async (userData, avatar) => {
          set({ isLoading: true });
          try {
            const response = await API.auth.register(userData, avatar);
            const { user } = response;

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });

            // Use Inertia to navigate to dashboard or email verification page
            router.visit('/dashboard');
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        logout: () => {
          set({ isLoading: true });

          // Use direct Inertia navigation to the logout route
          router.visit('/logout', {
            method: 'get',
            onFinish: () => {
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
            },
            preserveState: false,
            preserveScroll: false,
          });
        },

        checkAuth: async () => {
          set({ isLoading: true });
          try {
            const user = await API.auth.whoami();
            set({
              user,
              isAuthenticated: !!user,
              isLoading: false,
            });
          } catch (_error) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        },

        // Added for PIN management - refresh user data without full page reload
        refreshUser: async () => {
          try {
            const user = await API.auth.whoami();
            set({ user });
            return user;
          } catch (error) {
            console.error('Failed to refresh user data:', error);
            return null;
          }
        },

        updateProfile: async (data) => {
          const user = get().user;
          if (!user) throw new Error('User not authenticated');

          set({ isLoading: true });
          try {
            const updatedUser = await API.user.updateProfile(user.id, data);
            set({
              user: updatedUser,
              isLoading: false,
            });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        updateAvatar: async (file) => {
          const user = get().user;
          if (!user) throw new Error('User not authenticated');

          set({ isLoading: true });
          try {
            const updatedUser = await API.user.updateAvatar(user.id, file);
            set({
              user: updatedUser,
              isLoading: false,
            });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        getSocialLoginUrl: async (provider) => {
          const response = await API.auth.getSocialLoginUrl(provider);
          return response.url;
        },

        handleSocialLogin: async (provider, code) => {
          set({ isLoading: true });
          try {
            const response = await API.auth.socialLoginCallback(provider, code);
            const { user } = response;

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });

            // Use Inertia to navigate to dashboard after successful social login
            router.visit('/dashboard');
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        forgotPassword: async (email) => {
          set({ isLoading: true });
          try {
            const response = await API.auth.forgotPassword(email);
            set({ isLoading: false });
            return response;
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        resetPassword: async (data) => {
          set({ isLoading: true });
          try {
            const response = await API.auth.resetPassword(data);
            set({ isLoading: false });
            return response;
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        changePassword: async (data) => {
          set({ isLoading: true });
          try {
            const response = await API.auth.changePassword(data);
            set({ isLoading: false });
            return response;
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        resendEmailVerification: async () => {
          set({ isLoading: true });
          try {
            // Use inertiaApi to ensure proper API base path
            inertiaApi.post(
              'auth/email/verification-notification',
              {},
              {
                onFinish: () => {
                  set({ isLoading: false });
                },
              },
            );
            return { status: 'Verification link sent!' };
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        verifyEmail: async (id, hash) => {
          set({ isLoading: true });
          try {
            const response = await API.auth.verifyEmail(id, hash);

            // If verification is successful, refresh user data
            await get().checkAuth();

            set({ isLoading: false });
            return response;
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },
      }),
      {
        name: 'auth-storage', // localStorage key
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    { name: 'AuthStore' },
  ),
);

export default useAuthStore;

// State selector hooks - these don't cause unnecessary re-renders
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useIsEmailVerified = () =>
  useAuthStore((state) => (state.user?.email_verified_at ? true : false));
export const useHasPin = () =>
  useAuthStore((state) => (state.user?.has_pin ? true : false));
